import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, token });

    // Set the cookie on the server side with proper attributes
    response.cookies.set({
      name: 'session_token',
      value: token,
      httpOnly: false,
      secure: false, // Set to false for development
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Set session error:', error);
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
  }
}

