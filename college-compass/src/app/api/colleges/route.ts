import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const minFee = parseFloat(searchParams.get('minFee') || '0');
    const maxFee = parseFloat(searchParams.get('maxFee') || '1000000');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const whereClause: any = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        { fees: { gte: minFee, lte: maxFee } },
      ],
    };

    const [colleges, totalCount] = await Promise.all([
      prisma.college.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          courses: true,
        },
        orderBy: {
          rating: 'desc',
        },
      }),
      prisma.college.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      colleges,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
