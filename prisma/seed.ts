import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const rawUrl = process.env.DATABASE_URL || 'mysql://root:Berhasil1@localhost:3306/education_erp';
const mariadbUrl = rawUrl.replace(/^mysql:\/\//, 'mariadb://');
const adapter = new PrismaMariaDb(mariadbUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting MySQL Seeding for Education ERP...');

  // Clear existing data in reverse order of relations
  await prisma.auditLog.deleteMany();
  await prisma.cRMLead.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.pPDBApplication.deleteMany();
  await prisma.classRoom.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  // 1. Seed Branches (Pontianak)
  const br1 = await prisma.branch.create({
    data: {
      id: 'br-1',
      name: 'Cabang Serdam Pontianak (Pusat)',
      code: 'PTK-01',
      address: 'Jl. Sungai Raya Dalam (Serdam) No. 88, Pontianak',
      phone: '0561-734567',
      email: 'serdam@hello-academy.sch.id',
      pic: 'Drs. H. Mulyadi',
      status: 'Active',
      totalStudents: 520,
    },
  });

  const br2 = await prisma.branch.create({
    data: {
      id: 'br-2',
      name: 'Cabang Karya Baru Pontianak',
      code: 'PTK-02',
      address: 'Jl. Karya Baru No. 45, Pontianak',
      phone: '0561-765432',
      email: 'karyabaru@hello-academy.sch.id',
      pic: 'Siti Rahma, M.Pd.',
      status: 'Active',
      totalStudents: 340,
    },
  });

  const br3 = await prisma.branch.create({
    data: {
      id: 'br-3',
      name: 'Cabang Danau Sentarum Pontianak',
      code: 'PTK-03',
      address: 'Jl. Danau Sentarum No. 102, Pontianak',
      phone: '0561-789012',
      email: 'danausentarum@hello-academy.sch.id',
      pic: 'Budi Santoso, S.T.',
      status: 'Active',
      totalStudents: 290,
    },
  });

  console.log('✅ Branches seeded.');

  // 2. Seed Users
  await prisma.user.createMany({
    data: [
      { id: 'u-1', name: 'Ahmad Faisal (Super Admin)', email: 'admin@hello-academy.sch.id', role: 'super_admin', branchId: br1.id, avatar: '⚡', status: 'Active' },
      { id: 'u-2', name: 'Dewi Kartika (Admin Karya Baru)', email: 'karyabaru.admin@hello-academy.sch.id', role: 'admin_cabang', branchId: br2.id, avatar: '👩‍💼', status: 'Active' },
      { id: 'u-3', name: 'Bambang S. (Guru Matematika)', email: 'bambang@hello-academy.sch.id', role: 'guru', branchId: br1.id, avatar: '👨‍🏫', status: 'Active' },
      { id: 'u-4', name: 'Hendra Saputra (Staff Keuangan)', email: 'keuangan@hello-academy.sch.id', role: 'staff_keuangan', branchId: br1.id, avatar: '📊', status: 'Active' },
      { id: 'u-5', name: 'Ibu Susanti (Wali Murid)', email: 'susanti@gmail.com', role: 'wali_murid', branchId: br1.id, avatar: '👵', status: 'Active' },
      { id: 'u-6', name: 'Rizky Pratama (Siswa)', email: 'rizky@siswa.hello-academy.sch.id', role: 'siswa', branchId: br1.id, avatar: '🎓', status: 'Active' },
    ],
  });

  console.log('✅ Users seeded.');

  // 3. Seed Teachers
  const teacher1 = await prisma.teacher.create({
    data: {
      id: 'tch-1',
      nip: '19850112001',
      name: 'Bambang S., M.Pd.',
      subject: 'Matematika Terapan',
      branchId: br1.id,
      hourlyRate: 150000,
      teachingHoursThisMonth: 42,
      phone: '081299887766',
    },
  });

  await prisma.teacher.createMany({
    data: [
      { id: 'tch-2', nip: '19880315002', name: 'Dra. Endang Lestari', subject: 'Fisika Kuantum', branchId: br1.id, hourlyRate: 160000, teachingHoursThisMonth: 38, phone: '081311223344' },
      { id: 'tch-3', nip: '19920720003', name: 'Kevin Sanjaya, S.Si.', subject: 'Kimia & Biologi', branchId: br2.id, hourlyRate: 140000, teachingHoursThisMonth: 50, phone: '085644556677' },
    ],
  });

  console.log('✅ Teachers seeded.');

  // 4. Seed Parents
  const parent1 = await prisma.parent.create({
    data: {
      id: 'p-1',
      name: 'Ibu Susanti',
      phone: '081234567890',
      email: 'susanti@gmail.com',
      occupation: 'Wiraswasta',
    },
  });

  const parent2 = await prisma.parent.create({
    data: {
      id: 'p-2',
      name: 'Bpk. Hendro',
      phone: '081398765432',
      email: 'hendro@gmail.com',
      occupation: 'PNS',
    },
  });

  console.log('✅ Parents seeded.');

  // 5. Seed Students
  const std1 = await prisma.student.create({
    data: {
      id: 'std-101',
      nisn: '0058291029',
      name: 'Rizky Pratama',
      gender: 'L',
      grade: 'XII SMA (SNBT UTBK)',
      branchId: br1.id,
      parentId: parent1.id,
      status: 'Aktif',
      qrCode: 'QR-STD-101-RIZKY',
    },
  });

  await prisma.student.create({
    data: {
      id: 'std-102',
      nisn: '0058291030',
      name: 'Anisa Rahmawati',
      gender: 'P',
      grade: 'XII SMA (Kedokteran)',
      branchId: br1.id,
      parentId: parent2.id,
      status: 'Aktif',
      qrCode: 'QR-STD-102-ANISA',
    },
  });

  console.log('✅ Students seeded.');

  // 6. Seed Classes
  const class1 = await prisma.classRoom.create({
    data: {
      id: 'cls-1',
      name: 'Intensif SNBT UTBK 12-A',
      branchId: br1.id,
      grade: 'XII SMA',
      homeroomTeacherId: teacher1.id,
      capacity: 25,
      enrolled: 20,
      roomNumber: 'R-201',
    },
  });

  console.log('✅ ClassRooms seeded.');

  // 7. Seed PPDB Applications
  await prisma.pPDBApplication.createMany({
    data: [
      { id: 'ppdb-1', regNumber: 'PPDB-2026-001', applicantName: 'Dimas Setiawan', targetBranchId: br1.id, grade: 'X SMA', parentPhone: '08123456789', status: 'Approved', testScore: 88, downpaymentStatus: 'Paid' },
      { id: 'ppdb-2', regNumber: 'PPDB-2026-002', applicantName: 'Nadia Safira', targetBranchId: br2.id, grade: 'X SMA', parentPhone: '08198765432', status: 'Interview', testScore: 79, downpaymentStatus: 'Unpaid' },
      { id: 'ppdb-3', regNumber: 'PPDB-2026-003', applicantName: 'Fathan Azka', targetBranchId: br3.id, grade: 'X SMA', parentPhone: '08571122334', status: 'Pending', testScore: null, downpaymentStatus: 'Unpaid' },
    ],
  });

  console.log('✅ PPDB Applications seeded.');

  // 8. Seed Invoices
  await prisma.invoice.createMany({
    data: [
      { id: 'inv-101', invoiceNumber: 'INV/2026/08/001', studentName: 'Rizky Pratama', studentId: std1.id, branchId: br1.id, feeType: 'SPP', amount: 1250000, dueDate: '2026-08-10', status: 'Belum_Bayar' },
      { id: 'inv-102', invoiceNumber: 'INV/2026/08/002', studentName: 'Anisa Rahmawati', branchId: br1.id, feeType: 'SPP', amount: 1250000, dueDate: '2026-08-10', status: 'Lunas', paymentMethod: 'QRIS Instant', paidAt: '2026-08-02' },
      { id: 'inv-103', invoiceNumber: 'INV/2026/08/003', studentName: 'Bagas Aditya', branchId: br2.id, feeType: 'Uang_Pangkal', amount: 7500000, dueDate: '2026-08-15', status: 'Jatuh_Tempo' },
    ],
  });

  console.log('✅ Invoices seeded.');

  // 9. Seed Attendance
  await prisma.attendanceRecord.createMany({
    data: [
      { id: 'att-1', date: '2026-08-05', entityType: 'Siswa', entityName: 'Rizky Pratama', branchId: br1.id, status: 'Hadir', time: '06:55 AM' },
      { id: 'att-2', date: '2026-08-05', entityType: 'Siswa', entityName: 'Anisa Rahmawati', branchId: br1.id, status: 'Hadir', time: '07:02 AM' },
      { id: 'att-3', date: '2026-08-05', entityType: 'Guru', entityName: 'Bambang S., M.Pd.', branchId: br1.id, status: 'Hadir', time: '06:45 AM' },
    ],
  });

  console.log('✅ Attendance seeded.');

  // 10. Seed Exams
  await prisma.exam.createMany({
    data: [
      { id: 'ex-1', title: 'Ujian Tengah Semester - Matematika X', subject: 'Matematika', classId: class1.id, durationMinutes: 60, totalQuestions: 20, date: '2026-08-12', status: 'Published' },
      { id: 'ex-2', title: 'Quiz Harian - Fisika Dasar', subject: 'Fisika', classId: class1.id, durationMinutes: 30, totalQuestions: 10, date: '2026-08-06', status: 'Published' },
    ],
  });

  console.log('✅ Exams seeded.');

  // 11. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { id: 'log-1', timestamp: '2026-08-05 08:30:12', userName: 'Ahmad Faisal', userId: 'u-1', userRole: 'super_admin', action: 'Create Invoice', module: 'Finance', details: 'Dibuat invoice SPP bulan Agustus 2026 untuk Cabang Serdam' },
      { id: 'log-2', timestamp: '2026-08-05 09:14:05', userName: 'Dewi Kartika', userId: 'u-2', userRole: 'admin_cabang', action: 'Update Branch Status', module: 'Multi-Branch', details: 'Menyesuaikan jam operasional Cabang Karya Baru' },
    ],
  });

  console.log('✅ Audit Logs seeded.');

  // 12. Seed CRM Leads
  await prisma.cRMLead.createMany({
    data: [
      { id: 'ld-1', name: 'Orang Tua Farhan', phone: '081290909090', source: 'Instagram Ads', stage: 'Follow_Up', branchId: br1.id },
      { id: 'ld-2', name: 'Calon Wali Murid Maya', phone: '081377889900', source: 'Website Inquiry', stage: 'Placement_Test', branchId: br2.id },
    ],
  });

  console.log('✅ CRM Leads seeded.');

  console.log('🎉 MySQL Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
