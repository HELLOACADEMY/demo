import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withFastDb } from '@/lib/fastPrisma';
import { initialInvoices } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status');

    const whereCondition: Record<string, unknown> = {};
    if (branchId) whereCondition.branchId = branchId;
    if (status) whereCondition.status = status;

    const invoices = await withFastDb(
      prisma.invoice.findMany({
        where: whereCondition,
        include: {
          branch: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      initialInvoices as any
    );
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: true, data: initialInvoices });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber || `INV/${new Date().getFullYear()}/${Date.now()}`,
        studentName: body.studentName,
        studentId: body.studentId || null,
        branchId: body.branchId,
        feeType: body.feeType,
        amount: body.amount,
        dueDate: body.dueDate,
        status: body.status || 'Belum_Bayar',
        paymentMethod: body.paymentMethod || null,
        paidAt: body.paidAt || null,
      },
    });
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat tagihan baru' }, { status: 500 });
  }
}
