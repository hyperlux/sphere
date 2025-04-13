import { NextResponse } from 'next/server';
import { Database } from '@/lib/db/database.types';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { getUserProfile } from '@/lib/auth/getUserProfile';

type RouteParams = {
  params: {
    categoryId: string;
  };
};

export async function GET(request: Request, { params }: RouteParams) {
  const { categoryId } = params;

  const supabase = getSupabaseServerClient(request);

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    // Fetch topics for the given category, joining with users table to get creator's name
    // Also fetch the category name itself for context
    const { data: topics, error: topicsError } = await supabase
      .from('forum_topics')
      .select(`
        id,
        title,
        slug,
        content,
        created_at,
        last_activity_at,
        author_id,
        users!author_id ( id, username ),
        forum_categories ( id, name )
      `)
      .eq('category_id', categoryId)
      .order('last_activity_at', { ascending: false }); // Show most recently active topics first

    if (topicsError) {
      console.error(`Error fetching topics for category ${categoryId}:`, topicsError);
      return NextResponse.json({ error: 'Failed to fetch topics', details: topicsError.message }, { status: 500 });
    }

    const topicIds = topics?.map(t => String(t.id)) ?? [];

    let voteTotals: Record<string, number> = {};

    if (topicIds.length > 0) {
      const { data: votesData, error: votesError } = await supabase
        .from('vote_totals')
        .select('entity_id, total_votes')
        .in('entity_id', topicIds)
        .eq('entity_type', 'topic');

      if (votesError) {
        console.error('Error fetching vote totals:', votesError);
      } else {
        voteTotals = Object.fromEntries(
          (votesData ?? []).map(v => [String(v.entity_id), v.total_votes ?? 0])
        );
      }
    }

    const formattedData = topics?.map(topic => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      snippet: topic.content?.substring(0, 100) ?? '',
      createdAt: topic.created_at,
      lastActivityAt: topic.last_activity_at,
      voteCount: voteTotals[String(topic.id)] ?? 0,
      category: {
        id: topic.forum_categories?.id ?? null,
        name: topic.forum_categories?.name ?? null,
      },
      author: {
        id: topic.author_id ?? null
      }
    }));

    return NextResponse.json(formattedData || []);

  } catch (err) {
    console.error(`Unexpected error fetching topics for category ${categoryId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  console.log('--- /api/forum/categories/[categoryId]/topics POST called ---');

  const { categoryId } = params;

  const supabase = getSupabaseServerClient(request);

  let userProfile = await getUserProfile(supabase);
  console.log('Fetched user profile:', userProfile);

  if (!userProfile) {
    // Attempt to create user profile on the fly
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log('Supabase auth.getUser result:', user, userError);

    if (!userError && user) {
      const usernameFallback = user.email ?? user.id;
      const { data: newProfile, error: createProfileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          username: usernameFallback,
        } as any)
        .select('id')
        .single();

      console.log('Profile insert result:', newProfile, createProfileError);

      if (!createProfileError && newProfile) {
        userProfile = newProfile;
      } else {
        console.error('Error creating user profile:', createProfileError);
      }
    }
  }

  console.log('Final userProfile before authorization check:', userProfile);

  if (!userProfile) {
    return NextResponse.json(
      { error: 'Unauthorized or user profile not found' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const insertPayload = {
      title,
      slug,
      content,
      category_id: categoryId,
      author_id: userProfile.id,
    };
    console.log('Insert payload:', insertPayload);

    const { data, error } = await supabase
      .from('forum_topics')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Error creating topic:', error);
      return NextResponse.json(
        { error: 'Failed to create topic', details: error.message, supabaseError: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Unexpected error creating topic:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
