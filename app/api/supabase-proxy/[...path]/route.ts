import { NextRequest, NextResponse } from 'next/server';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey',
    },
  });
}

// This determines the Supabase URL based on the environment
const getSupabaseUrl = () => {
  // In Docker, use the service name (only accessible from server-side)
  if (process.env.NODE_ENV === 'production') {
    return 'http://supabase-api:3000';
  }
  // In development, use localhost
  return 'http://127.0.0.1:54321';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const fullPath = `${getSupabaseUrl()}/${path}${url.search}`;
    
    console.log(`[Supabase Proxy] GET ${fullPath}`);
    
    const response = await fetch(fullPath, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    });
    
    if (!response.ok) {
      console.error(`[Supabase Proxy] Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Supabase Proxy] Exception:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    const fullPath = `${getSupabaseUrl()}/${path}`;
    
    console.log(`[Supabase Proxy] POST ${fullPath}`);
    
    const response = await fetch(fullPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error(`[Supabase Proxy] Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Supabase Proxy] Exception:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Add other HTTP methods as needed
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    const fullPath = `${getSupabaseUrl()}/${path}`;
    
    console.log(`[Supabase Proxy] PUT ${fullPath}`);
    
    const response = await fetch(fullPath, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error(`[Supabase Proxy] Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Supabase Proxy] Exception:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const fullPath = `${getSupabaseUrl()}/${path}${url.search}`;
    
    console.log(`[Supabase Proxy] DELETE ${fullPath}`);
    
    const response = await fetch(fullPath, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    });
    
    if (!response.ok) {
      console.error(`[Supabase Proxy] Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Supabase Proxy] Exception:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    const fullPath = `${getSupabaseUrl()}/${path}`;
    
    console.log(`[Supabase Proxy] PATCH ${fullPath}`);
    
    const response = await fetch(fullPath, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error(`[Supabase Proxy] Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Supabase Proxy] Exception:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
