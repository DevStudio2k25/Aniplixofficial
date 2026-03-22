import { NextRequest, NextResponse } from 'next/server';
import { getAppById, updateApp, deleteApp, getAppRatings, getAppAverageRating, App } from '@/lib/firebase-service';

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
    
    // Explicitly pick fields to update
    const updateData: Partial<App> = {
      name: data.name,
      description: data.description,
      author: data.author,
      version: data.version,
      category: data.category,
      tags: data.tags,
      download_url: data.download_url,
      screenshots: data.screenshots,
      iconUrl: data.iconUrl,
      featured: data.featured,
    };

    const app = await updateApp(id, updateData);

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
    console.log('DELETE request received for ID:', id);
    
    const success = await deleteApp(id);
    console.log('Delete operation success:', success);

    if (!success) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
