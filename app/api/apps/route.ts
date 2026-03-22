import { NextRequest, NextResponse } from 'next/server';
import {
  getAllApps,
  searchApps,
  getCategories,
  addApp,
  App,
} from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2026apps4all';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const getCats = searchParams.get('categories');

    if (getCats === 'true') {
      const categories = getCategories();
      return NextResponse.json({ categories });
    }

    let apps: App[];
    if (query) {
      apps = searchApps(query, category || undefined);
    } else {
      apps = getAllApps();
    }

    return NextResponse.json({ apps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.author || !data.version || !data.category || !data.download_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const app = addApp({
      name: data.name,
      description: data.description,
      author: data.author,
      version: data.version,
      category: data.category,
      tags: data.tags || '',
      github_link: data.github_link || '',
      download_url: data.download_url,
      screenshots: data.screenshots || '',
      iconUrl: data.iconUrl || null,
      featured: data.featured || 0,
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
