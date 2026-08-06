import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data cabang' }, { status: 500 });
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
