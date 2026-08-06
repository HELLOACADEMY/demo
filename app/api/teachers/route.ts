import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const whereCondition = branchId ? { branchId } : {};

    const teachers = await prisma.teacher.findMany({
      where: whereCondition,
      include: {
        branch: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data guru' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teacher = await prisma.teacher.create({
      data: {
        nip: body.nip,
        name: body.name,
        subject: body.subject,
        branchId: body.branchId,
        hourlyRate: body.hourlyRate || 0,
        teachingHoursThisMonth: body.teachingHoursThisMonth || 0,
        phone: body.phone,
      },
    });
    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambah guru' }, { status: 500 });
  }
}
