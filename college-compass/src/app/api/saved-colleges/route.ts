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

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.userId },
      include: {
        college: {
          include: {
            courses: true
          }
        }
      }
    });

    return NextResponse.json(saved.map(s => s.college));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { collegeId } = await req.json();

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.userId,
          collegeId
        }
      }
    });

    if (existing) {
      await prisma.savedCollege.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: 'Removed from saved' });
    } else {
      await prisma.savedCollege.create({
        data: {
          userId: user.userId,
          collegeId
        }
      });
      return NextResponse.json({ message: 'Saved successfully' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
