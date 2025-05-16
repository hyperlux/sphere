import type { IronSessionOptions } from 'iron-session';

// Define the shape of the data stored in the session
export interface SessionData {
  userId?: string; // Store the user's ID
  username?: string;
  isLoggedIn: boolean;
}

export const sessionOptions: IronSessionOptions = {
  cookieName: 'sphere_session', // Choose a name for your session cookie
  password: process.env.SESSION_SECRET || 'YOUR_COMPLEX_PASSWORD_AT_LEAST_32_CHARACTERS_LONG',
  // Make sure to set a strong password in your environment variables (e.g., .env.local)
  // and ensure it is at least 32 characters long.
  // process.env.SESSION_SECRET should be used in production.
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'lax', // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // Session duration: 7 days
  },
};

// This is where we specify the typings of req.session.* during a request
declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
}
