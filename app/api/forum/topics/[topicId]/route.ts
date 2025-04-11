import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';

type RouteParams = {
  params: {
    topicId: string;
  };
};

// GET /api/forum/topics/[topicId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { topicId } = params;
  if (!topicId) {
    return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient(request);

  const { data, error } = await supabase
    .from('forum_topics')
    .select('id, title, slug, content, category_id, author_id, created_at, last_activity_at')
    .eq('id', topicId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch topic', details: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
