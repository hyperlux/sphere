import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Keep only cookies import
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/database.types';

export async function POST(request: NextRequest) {
  const cookieStore = cookies(); // Get cookie store

  // Define cookie handling methods separately
  const cookieMethods = {
    get(name: string) {
      const cookie = cookieStore.get(name)?.value;
      // Log cookie access attempts
      console.log(`[API Cookie GET] Trying to get cookie: ${name}. Found: ${cookie ? 'Yes' : 'No'}`);
      return cookie;
    },
    set(name: string, value: string, options: CookieOptions) {
      try {
        cookieStore.set({ name, value, ...options });
      } catch (error) {
        console.error(`Failed to set cookie '${name}':`, error);
      }
    },
    remove(name: string, options: CookieOptions) {
      try {
        cookieStore.set({ name, value: '', ...options });
      } catch (error) {
        console.error(`Failed to remove cookie '${name}':`, error);
      }
    },
  };

  // Pass the defined methods to createServerClient
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods } // Pass the handler object
  );

  try {
    // Get the authenticated user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return NextResponse.json({ error: 'Failed to get user session' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: User not logged in' }, { status: 401 });
    }
    const userId = session.user.id; // Use userId consistently

    // Extract request body
    const { title, content, categoryId } = await request.json();

    // Validate Input (Basic)
    if (!title || !content || !categoryId) {
       return NextResponse.json({ error: 'Missing required fields: title, content, categoryId' }, { status: 400 });
    }

    // Generate slug (as before)
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Insert topic
    // Note: Removed 'content' from topic insert based on schema review (content belongs to post)
    const { data: newTopic, error: topicError } = await supabase
      .from('forum_topics')
      .insert({
        title: title.trim(),
        category_id: categoryId,
        author_id: userId, // Use userId variable
        slug: slug,
      })
      .select()
      .single();

    if (topicError) {
      console.error('Error creating forum topic:', topicError);
      if (topicError.code === '23503') { // Foreign key violation likely on category_id or author_id
         return NextResponse.json({ error: 'Invalid Category ID or Author ID', details: topicError.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create topic', details: topicError.message }, { status: 500 });
    }

    if (!newTopic) {
       return NextResponse.json({ error: 'Failed to create topic: No data returned' }, { status: 500 });
    }

    // Insert the initial post
    const { error: postError } = await supabase
      .from('forum_posts')
      .insert({
        topic_id: newTopic.id,
        author_id: userId, // Use userId variable
        content: content.trim(),
      });

    if (postError) {
      console.error(`Error creating the first post for topic ${newTopic.id}:`, postError);
      // Consider rolling back topic creation if possible (e.g., via RPC or manual delete)
      // For now, return error indicating partial failure
      return NextResponse.json({
          error: 'Topic created, but failed to create the initial post',
          details: postError.message,
          topic: newTopic
      }, { status: 500 });
    }

    // Return the created topic data
    return NextResponse.json(newTopic, { status: 201 });

  } catch (error) {
    // Catch potential JSON parsing errors or other unexpected issues
    console.error('Unexpected error creating topic:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
