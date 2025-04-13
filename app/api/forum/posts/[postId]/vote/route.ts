import { NextResponse, NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/db/database.types';

type RouteParams = {
  params: {
    postId: string;
  };
};

// POST /api/forum/posts/[postId]/vote
export async function POST(request: NextRequest, { params }: RouteParams) {
    const { postId } = params;
    const cookieStore = cookies();

    // Create authenticated client
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (e) { console.error(e); } },
                remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) { console.error(e); } },
            },
        }
    );

    try {
        // 1. Get User Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // 2. Validate Post ID
        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // 3. Parse Request Body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request body: Must be JSON' }, { status: 400 });
        }
        const { voteType } = body; // Expect voteType: 1 for upvote, -1 for downvote, 0 to remove vote

        // 4. Validate Vote Type
        if (![1, -1, 0].includes(voteType)) {
            return NextResponse.json({ error: 'Invalid voteType: Must be 1 (up), -1 (down), or 0 (remove)' }, { status: 400 });
        }

        // 5. Perform Upsert or Delete Vote
        if (voteType === 0) {
            // Remove existing vote
            const { error: deleteError } = await supabase
                .from('votes') // Use the correct table name from schema
                .delete()
                .match({ user_id: userId, post_id: postId });

            if (deleteError) {
                console.error(`Error removing vote for post ${postId} by user ${userId}:`, deleteError);
                return NextResponse.json({ error: 'Failed to remove vote', details: deleteError.message }, { status: 500 });
            }
             return NextResponse.json({ success: true, message: 'Vote removed' });

        } else {
             // Upsert vote (insert or update if exists)
             // Note: Your schema uses 'vote_type: boolean'. We need to adapt. Assuming true=upvote, false=downvote.
             const isUpvote = voteType === 1;

             const { error: upsertError } = await supabase
                .from('votes')
                .upsert(
                    {
                        entity_id: postId,
                        entity_type: "post",
                        vote: isUpvote, // Adapt to boolean schema
                    },
                    {
                        onConflict: 'user_id, entity_id, entity_type', // Specify conflict columns based on your unique constraint
                    }
                );

            if (upsertError) {
                console.error(`Error upserting vote for post ${postId} by user ${userId}:`, upsertError);
                 // Check for specific errors like foreign key violation if postId is invalid
                if (upsertError.code === '23503') {
                    return NextResponse.json({ error: 'Invalid Post ID or User ID', details: upsertError.message }, { status: 400 });
                }
                return NextResponse.json({ error: 'Failed to record vote', details: upsertError.message }, { status: 500 });
            }
             return NextResponse.json({ success: true, message: 'Vote recorded' });
        }

        // Optional: Fetch and return the new vote score for the post
        // This might require a separate query or a database function like 'get_vote_score' seen in your types

    } catch (err) {
        console.error(`Unexpected error voting on post ${postId}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
