import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.destroy(); // Destroys the session data

    // Optionally, you can also try to clear the cookie explicitly,
    // though session.destroy() should handle it based on iron-session's behavior.
    // NextResponse will often handle cookie clearing if instructed.
    
    const response = NextResponse.json(
        { message: 'Logout successful' }, 
        { status: 200 }
    );

    // Ensure the cookie is cleared by setting Max-Age to 0 or an expired date
    // iron-session's destroy() typically handles this by setting an expired cookie state.
    // If direct cookie manipulation is needed:
    // response.cookies.set(sessionOptions.cookieName, '', { maxAge: -1 });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during logout' }, { status: 500 });
  }
}

// If you prefer GET for logout:
// export async function GET(req: NextRequest) {
//   try {
//     const session = await getIronSession<SessionData>(cookies(), sessionOptions);
//     session.destroy();
//     return NextResponse.json({ message: 'Logout successful_V2' }, { status: 200 });
//   } catch (error) {
//     console.error('Logout error:', error);
//     return NextResponse.json({ message: 'An unexpected error occurred during logout' }, { status: 500 });
//   }
// }
