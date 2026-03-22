import { NextRequest, NextResponse } from 'next/server';
import { getAppById, updateApp, deleteApp, getAppRatings, getAppAverageRating } from '@/lib/firebase-service';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2026apps4all';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await getAppById(id);

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    const ratings = await getAppRatings(id);
    const ratingStats = await getAppAverageRating(id);

    return NextResponse.json({
      app,
      ratings,
      ratingStats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const app = await updateApp(id, data);

    return NextResponse.json(app);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteApp(id);

    if (!success) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
