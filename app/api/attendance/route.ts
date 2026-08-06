import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const whereCondition = branchId ? { branchId } : {};

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: whereCondition,
      include: {
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data presensi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const today = body.date || new Date().toISOString().split('T')[0];
    const currentTime = body.time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Check if an attendance record for this entity already exists today
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        date: today,
        entityName: body.entityName,
        branchId: body.branchId,
      },
    });

    if (existingRecord) {
      // Scan 2 = Jam Pulang (Check-Out)
      const updatedRecord = await prisma.attendanceRecord.update({
        where: { id: existingRecord.id },
        data: {
          scanType: 'Jam_Pulang',
          checkOutTime: currentTime,
          time: `${existingRecord.checkInTime || existingRecord.time} - ${currentTime}`,
        },
      });
      return NextResponse.json({
        success: true,
        data: updatedRecord,
        action: 'CHECK_OUT',
        message: `Scan Ke-2 Berhasil! [${body.entityName}] Presensi JAM PULANG pukul ${currentTime}`,
      });
    } else {
      // Scan 1 = Jam Masuk (Check-In)
      const newRecord = await prisma.attendanceRecord.create({
        data: {
          date: today,
          entityType: body.entityType || 'Siswa',
          entityName: body.entityName,
          branchId: body.branchId,
          status: body.status || 'Hadir',
          scanType: 'Jam_Masuk',
          time: currentTime,
          checkInTime: currentTime,
        },
      });
      return NextResponse.json({
        success: true,
        data: newRecord,
        action: 'CHECK_IN',
        message: `Scan Ke-1 Berhasil! [${body.entityName}] Presensi JAM MASUK pukul ${currentTime}`,
      });
    }
  } catch (error) {
    console.error('Error processing QR attendance:', error);
    return NextResponse.json({ success: false, error: 'Gagal memproses QR presensi' }, { status: 500 });
  }
}
