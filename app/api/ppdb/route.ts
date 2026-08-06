import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const whereCondition = branchId ? { targetBranchId: branchId } : {};

    const ppdbList = await prisma.pPDBApplication.findMany({
      where: whereCondition,
      include: {
        targetBranch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: ppdbList });
  } catch (error) {
    console.error('Error fetching PPDB list:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data PPDB' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ppdb = await prisma.pPDBApplication.create({
      data: {
        regNumber: body.regNumber || `PPDB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        applicantName: body.applicantName,
        targetBranchId: body.targetBranchId,
        grade: body.grade,
        parentPhone: body.parentPhone,
        status: body.status || 'Pending',
        testScore: body.testScore ?? null,
        downpaymentStatus: body.downpaymentStatus || 'Unpaid',
      },
    });
    return NextResponse.json({ success: true, data: ppdb }, { status: 201 });
  } catch (error) {
    console.error('Error creating PPDB application:', error);
    return NextResponse.json({ success: false, error: 'Gagal pendaftaran PPDB' }, { status: 500 });
  }
}
