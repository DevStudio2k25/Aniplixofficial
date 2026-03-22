import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2026apps4all';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      // Generate a simple session token (in production, use proper JWT or session management)
      const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
      
      return NextResponse.json({ 
        success: true,
        token: sessionToken 
      });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}