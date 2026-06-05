import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { collegeId, content, rating } = await req.json();

    if (!collegeId || !content || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Optional: Check if user already reviewed this college
    const existing = await prisma.review.findFirst({
      where: {
        userId: user.userId,
        collegeId: collegeId,
      },
    });

    if (existing) {
       return NextResponse.json({ error: 'You have already reviewed this college' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating: Number(rating),
        userId: user.userId,
        collegeId,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    // Update college average rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true }
    });

    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: avgRating }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
