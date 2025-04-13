import { NextResponse } from 'next/server';
import { Database } from '@/lib/db/database.types';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { getUserProfile } from '@/lib/auth/getUserProfile';

type RouteParams = {
  params: {
    topicId: string;
  };
};

export async function POST(request: Request, { params }: RouteParams) {
  const { topicId } = params;

  const supabase = getSupabaseServerClient(request);

  try {
    const userProfile = await getUserProfile(supabase);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Unauthorized or user profile not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { vote } = body;

    if (![1, -1].includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote value. Must be 1 or -1.' },
        { status: 400 }
      );
    }

    const { error: upsertError } = await supabase
      .from('votes')
      .upsert(
        [
          {
            entity_type: 'topic',
            entity_id: topicId,
            vote: vote === 1,
          },
        ],
        { onConflict: 'entity_type,entity_id,user_id' }
      );

    if (upsertError) {
      console.error('Error upserting vote:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save vote', details: upsertError.message },
        { status: 500 }
      );
    }

    const { data: voteTotalData, error: totalError } = await supabase
      .from('vote_totals')
      .select('total_votes')
      .eq('entity_type', 'topic')
      .eq('entity_id', topicId)
      .single();

    if (totalError) {
      console.error('Error fetching updated vote total:', totalError);
    }

    return NextResponse.json({
      success: true,
      voteCount: voteTotalData?.total_votes ?? 0,
    });
  } catch (err) {
    console.error('Unexpected error in vote API:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
