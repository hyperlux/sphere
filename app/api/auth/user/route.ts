import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ isLoggedIn: false, user: null }, { status: 200 }); // Or status 401 if you prefer strict unauthorized
    }

    // Fetch user details from the database
    // Ensure you don't select the password_hash or other sensitive info
    try {
      const userResult = await query(
        'SELECT id, username, email, avatar_url, bio, created_at, interests, skills, project_links FROM public.users WHERE id = $1',
        [session.userId]
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        // This case might indicate an issue, e.g., user deleted but session still active
        // You might want to destroy the session here
        session.destroy();
        return NextResponse.json({ isLoggedIn: false, user: null, message: 'User not found, session cleared' }, { status: 404 });
      }

      const user = userResult.rows[0];
      return NextResponse.json({ 
        isLoggedIn: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatar_url,
          bio: user.bio,
          createdAt: user.created_at,
          interests: user.interests,
          skills: user.skills,
          projectLinks: user.project_links,
          // Add any other non-sensitive fields you need for the frontend
        }
      }, { status: 200 });

    } catch (dbError) {
      console.error('DB error fetching user for session:', dbError);
      // Potentially destroy session if DB error indicates a problem that shouldn't keep user logged in
      // session.destroy(); 
      return NextResponse.json({ isLoggedIn: false, user: null, message: 'Error fetching user details' }, { status: 500 });
    }

  } catch (error) {
    console.error('Session/User API error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
