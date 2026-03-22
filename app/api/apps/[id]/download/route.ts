import { NextRequest, NextResponse } from 'next/server';
import { getAppById, recordDownload } from '@/lib/firebase-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await getAppById(id);

    if (!app || !app.download_url) {
      return NextResponse.json({ error: 'App or download URL not found' }, { status: 404 });
    }

    // Record the download
    await recordDownload(id);

    // Redirect to the download URL
    return NextResponse.redirect(app.download_url, { status: 302 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
