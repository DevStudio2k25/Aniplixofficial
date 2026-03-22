import { NextRequest, NextResponse } from 'next/server';
import { getAppById, recordDownload } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = getAppById(parseInt(id));

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Record the download
    recordDownload(parseInt(id));

    // Redirect to the download URL
    return NextResponse.redirect(app.download_url, { status: 302 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
