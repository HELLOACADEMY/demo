import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withFastDb } from '@/lib/fastPrisma';
import { initialBranches } from '@/lib/store';

export async function GET() {
  try {
    const branches = await withFastDb(
      prisma.branch.findMany({ orderBy: { createdAt: 'asc' } }),
      initialBranches
    );
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    return NextResponse.json({ success: true, data: initialBranches });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const branch = await prisma.branch.create({
      data: {
        name: body.name,
        code: body.code,
        address: body.address,
        phone: body.phone,
        email: body.email,
        pic: body.pic,
        status: body.status || 'Active',
        totalStudents: body.totalStudents || 0,
      },
    });
    return NextResponse.json({ success: true, data: branch }, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambah cabang' }, { status: 500 });
  }
}
