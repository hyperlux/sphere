import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/client'; // Your PostgreSQL query function
import { sessionOptions, SessionData } from '@/lib/auth/session'; // Iron Session configuration
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body; // Assuming login with email for now, can be adapted for username

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // 2. Find user by email
    let user;
    try {
      // Adjust query if you want to allow login with username as well: 'SELECT * FROM public.users WHERE email = $1 OR username = $1'
      const userResult = await query('SELECT * FROM public.users WHERE email = $1', [email]);
      if (!userResult.rows || userResult.rows.length === 0) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 }); // Unauthorized
      }
      user = userResult.rows[0];
    } catch (dbError) {
      console.error('DB error finding user:', dbError);
      return NextResponse.json({ message: 'Error finding user' }, { status: 500 });
    }

    // 3. Compare password with stored hash
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Create session and log the user in
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.userId = user.id;
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();

    // 5. Respond with success (excluding password hash)
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
      message: 'Login successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred on the server' }, { status: 500 });
  }
}
