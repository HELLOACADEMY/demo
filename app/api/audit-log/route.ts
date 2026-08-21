import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withFastDb } from '@/lib/fastPrisma';
import { initialAuditLogs } from '@/lib/store';

export async function GET() {
  try {
    const auditLogs = await withFastDb(
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      initialAuditLogs
    );
    return NextResponse.json({ success: true, data: auditLogs });
  } catch (error) {
    return NextResponse.json({ success: true, data: initialAuditLogs });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const logData = {
      timestamp: body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: body.userName,
      userRole: body.userRole,
      action: body.action,
      module: body.module,
      details: body.details,
    };
    const log = await withFastDb(
      prisma.auditLog.create({ data: logData }),
      { id: `log-${Date.now()}`, ...logData } as any
    );
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: true }, { status: 201 });
  }
}
