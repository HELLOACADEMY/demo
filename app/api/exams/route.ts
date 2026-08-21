import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withFastDb } from '@/lib/fastPrisma';
import { initialExams } from '@/lib/store';

export async function GET() {
  try {
    const exams = await withFastDb(
      prisma.exam.findMany({
        include: {
          classRoom: { select: { name: true, grade: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      initialExams
    );
    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    return NextResponse.json({ success: true, data: initialExams });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const exam = await prisma.exam.create({
      data: {
        title: body.title,
        subject: body.subject,
        classId: body.classId,
        durationMinutes: body.durationMinutes || 60,
        totalQuestions: body.totalQuestions || 10,
        date: body.date,
        status: body.status || 'Draft',
      },
    });
    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat ujian' }, { status: 500 });
  }
}
