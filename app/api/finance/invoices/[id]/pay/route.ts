import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'Lunas',
        paymentMethod: body.paymentMethod || 'Tunai',
        paidAt: new Date().toISOString().split('T')[0],
      },
    });

    return NextResponse.json({ success: true, data: updatedInvoice });
  } catch (error) {
    console.error('Error paying invoice:', error);
    return NextResponse.json({ success: false, error: 'Gagal memproses pembayaran invoice' }, { status: 500 });
  }
}
