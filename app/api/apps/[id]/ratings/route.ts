import { NextRequest, NextResponse } from 'next/server';
import { addRating, getAppRatings, getAppAverageRating } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ratings = getAppRatings(parseInt(id));
    const ratingStats = getAppAverageRating(parseInt(id));

    return NextResponse.json({
      ratings,
      ratingStats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const rating = addRating(parseInt(id), data.rating, data.review);

    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
