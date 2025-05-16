import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/client'; // Your PostgreSQL query function
import { sessionOptions, SessionData } from '@/lib/auth/session'; // Iron Session configuration
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    // 1. Validate input
    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Email, username, and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    // Add more validation as needed (e.g., email format, username syntax)

    // 2. Check if user already exists (by email or username)
    try {
      const existingUserCheck = await query(
        'SELECT id FROM public.users WHERE email = $1 OR username = $2',
        [email, username]
      );
      if (existingUserCheck.rowCount && existingUserCheck.rowCount > 0) {
        return NextResponse.json({ message: 'User with this email or username already exists' }, { status: 409 }); // 409 Conflict
      }
    } catch (dbError) {
      console.error('DB error checking existing user:', dbError);
      return NextResponse.json({ message: 'Error checking user existence' }, { status: 500 });
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert new user into the database
    let newUser;
    try {
      const insertResult = await query(
        'INSERT INTO public.users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
      );
      if (!insertResult.rows || insertResult.rows.length === 0) {
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
      }
      newUser = insertResult.rows[0];
    } catch (dbError) {
      console.error('DB error creating user:', dbError);
      return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }

    // 5. Create session and log the user in
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.userId = newUser.id;
    session.username = newUser.username;
    session.isLoggedIn = true;
    await session.save();

    // 6. Respond with success (excluding password hash)
    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.created_at,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    // Differentiate between validation errors and other server errors
    if (error.message.includes('required') || error.message.includes('characters long')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server' }, { status: 500 });
  }
}
