import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, data: auditLogs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil audit log' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const log = await prisma.auditLog.create({
      data: {
        timestamp: body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
        userName: body.userName,
        userRole: body.userRole,
        action: body.action,
        module: body.module,
        details: body.details,
      },
    });
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ success: false, error: 'Gagal mencatat audit log' }, { status: 500 });
  }
}
