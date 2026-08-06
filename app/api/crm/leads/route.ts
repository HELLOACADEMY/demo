import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const whereCondition = branchId ? { branchId } : {};

    const leads = await prisma.cRMLead.findMany({
      where: whereCondition,
      include: {
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data lead CRM' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await prisma.cRMLead.create({
      data: {
        name: body.name,
        phone: body.phone,
        source: body.source || 'Website',
        stage: body.stage || 'Lead_Baru',
        branchId: body.branchId,
      },
    });
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating CRM lead:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambah lead' }, { status: 500 });
  }
}
