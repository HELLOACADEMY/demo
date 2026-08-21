import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withFastDb } from '@/lib/fastPrisma';
import { initialStudents } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const whereCondition = branchId ? { branchId } : {};

    const students = await withFastDb(
      prisma.student.findMany({
        where: whereCondition,
        include: {
          branch: { select: { name: true, code: true } },
          parent: { select: { name: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      initialStudents as any
    );
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: true, data: initialStudents });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: {
        nisn: body.nisn,
        name: body.name,
        gender: body.gender,
        grade: body.grade,
        branchId: body.branchId,
        parentId: body.parentId,
        status: body.status || 'Aktif',
        qrCode: body.qrCode || `QR-${Date.now()}`,
      },
    });
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 });
  }
}
