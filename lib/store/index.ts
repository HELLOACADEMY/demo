export type Role = 'super_admin' | 'admin_cabang' | 'guru' | 'staff_keuangan' | 'wali_murid' | 'siswa';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  pic: string;
  status: 'Active' | 'Inactive';
  totalStudents: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId: string;
  avatar: string;
  status: 'Active' | 'Inactive';
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  grade: string;
  branchId: string;
  parentId: string;
  status: 'Aktif' | 'Mutasi' | 'Alumni' | 'Non-Aktif';
  qrCode: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  childrenIds: string[];
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  subject: string;
  branchId: string;
  hourlyRate: number;
  teachingHoursThisMonth: number;
  phone: string;
}

export interface PPDBApplication {
  id: string;
  regNumber: string;
  nisn?: string;
  applicantName: string;
  gender?: 'L' | 'P';
  birthInfo?: string;
  previousSchool?: string;
  grade: string;
  parentName?: string;
  parentPhone: string;
  homeAddress?: string;
  targetBranchId: string;
  status: 'Pending' | 'Interview' | 'Approved' | 'Rejected';
  testScore?: number;
  downpaymentStatus: 'Unpaid' | 'Paid';
}

export interface ClassRoom {
  id: string;
  name: string;
  branchId: string;
  grade: string;
  homeroomTeacherId: string;
  capacity: number;
  enrolled: number;
  roomNumber: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  entityType: 'Siswa' | 'Guru' | 'Staff';
  entityName: string;
  branchId: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Terlambat';
  time: string;
  scanType?: 'Jam Masuk' | 'Jam Pulang';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  branchId: string;
  feeType: 'SPP' | 'Uang Pangkal' | 'Buku' | 'Ujian';
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Bayar' | 'Jatuh Tempo' | 'Menunggu ACC Admin';
  paymentMethod?: string;
  paidAt?: string;
  paymentProofUrl?: string;
  senderBank?: string;
  senderName?: string;
  transferDate?: string;
  transferNotes?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  classId: string;
  durationMinutes: number;
  totalQuestions: number;
  date: string;
  status: 'Draft' | 'Published' | 'Completed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  details: string;
}

export interface CRMLead {
  id: string;
  name: string;
  phone: string;
  source: string;
  stage: 'Lead Baru' | 'Follow Up' | 'Placement Test' | 'Diterima' | 'Batal';
  branchId: string;
}

// Initial Seed Data: 3 Pontianak Branches
export const initialBranches: Branch[] = [
  { id: 'br-1', name: 'Cabang Sungai Raya Dalam (Pusat)', code: 'SRD-01', address: 'Jl. Sui Raya Dlm No.15, Pontianak', phone: '0561-734567', email: 'sungairaya@bsmart.sch.id', pic: 'Drs. H. Mulyadi', status: 'Active', totalStudents: 520 },
  { id: 'br-2', name: 'Cabang Danau Sentarum', code: 'DSR-02', address: 'Jl. Danau Sentarum No.17-18, Pontianak', phone: '0561-789012', email: 'danausentarum@bsmart.sch.id', pic: 'Budi Santoso, S.T.', status: 'Active', totalStudents: 290 },
  { id: 'br-3', name: 'Cabang Karya Baru', code: 'KRB-03', address: 'Jl. Karya Baru No.77, Pontianak', phone: '0561-765432', email: 'karyabaru@bsmart.sch.id', pic: 'Siti Rahma, M.Pd.', status: 'Active', totalStudents: 340 },
];

export const initialUsers: User[] = [
  { id: 'u-1', name: 'Ahmad Faisal (Super Admin)', email: 'admin@bsmart.sch.id', role: 'super_admin', branchId: 'br-1', avatar: '⚡', status: 'Active' },
  { id: 'u-2', name: 'Dewi Kartika (Admin Karya Baru)', email: 'karyabaru.admin@bsmart.sch.id', role: 'admin_cabang', branchId: 'br-2', avatar: '👩‍💼', status: 'Active' },
  { id: 'u-3', name: 'Bambang S. (Guru Matematika)', email: 'bambang@bsmart.sch.id', role: 'guru', branchId: 'br-1', avatar: '👨‍🏫', status: 'Active' },
  { id: 'u-4', name: 'Hendra Saputra (Staff Keuangan)', email: 'keuangan@bsmart.sch.id', role: 'staff_keuangan', branchId: 'br-1', avatar: '📊', status: 'Active' },
  { id: 'u-5', name: 'Ibu Susanti (Wali Murid)', email: 'susanti@gmail.com', role: 'wali_murid', branchId: 'br-1', avatar: '👵', status: 'Active' },
  { id: 'u-6', name: 'Rizky Pratama (Siswa)', email: 'rizky@siswa.bsmart.sch.id', role: 'siswa', branchId: 'br-1', avatar: '🎓', status: 'Active' },
];

// Rich Seed Data: 12 Students across 3 Pontianak Branches
export const initialStudents: Student[] = [
  { id: 'std-101', nisn: '0058291029', name: 'Rizky Pratama', gender: 'L', grade: 'XII SMA (SNBT UTBK)', branchId: 'br-1', parentId: 'p-1', status: 'Aktif', qrCode: 'QR-STD-101-RIZKY' },
  { id: 'std-102', nisn: '0058291030', name: 'Anisa Rahmawati', gender: 'P', grade: 'XII SMA (Kedokteran)', branchId: 'br-1', parentId: 'p-2', status: 'Aktif', qrCode: 'QR-STD-102-ANISA' },
  { id: 'std-103', nisn: '0058291031', name: 'Bagas Aditya', gender: 'L', grade: 'XI SMA (Intensif)', branchId: 'br-2', parentId: 'p-3', status: 'Aktif', qrCode: 'QR-STD-103-BAGAS' },
  { id: 'std-104', nisn: '0058291032', name: 'Clarissa Putri', gender: 'P', grade: 'XII SMA (Sekolah Kedinasan)', branchId: 'br-3', parentId: 'p-4', status: 'Aktif', qrCode: 'QR-STD-104-CLARISSA' },
  { id: 'std-105', nisn: '0058291033', name: 'Farhan Ramadhan', gender: 'L', grade: 'GAP YEAR / Alumni', branchId: 'br-1', parentId: 'p-5', status: 'Aktif', qrCode: 'QR-STD-105-FARHAN' },
  { id: 'std-106', nisn: '0058291034', name: 'Nabila Syakira', gender: 'P', grade: 'IX SMP Favorit', branchId: 'br-2', parentId: 'p-6', status: 'Aktif', qrCode: 'QR-STD-106-NABILA' },
  { id: 'std-107', nisn: '0058291035', name: 'Dimas Setiawan', gender: 'L', grade: 'X SMA Reguler', branchId: 'br-1', parentId: 'p-7', status: 'Aktif', qrCode: 'QR-STD-107-DIMAS' },
  { id: 'std-108', nisn: '0058291036', name: 'Maya Indah', gender: 'P', grade: 'VI SD Juara Kelas', branchId: 'br-3', parentId: 'p-8', status: 'Aktif', qrCode: 'QR-STD-108-MAYA' },
  { id: 'std-109', nisn: '0058291037', name: 'Fathan Azka', gender: 'L', grade: 'XII SMA (Kedinasan STAN)', branchId: 'br-2', parentId: 'p-9', status: 'Mutasi', qrCode: 'QR-STD-109-FATHAN' },
  { id: 'std-110', nisn: '0058291038', name: 'Zahra Aulia', gender: 'P', grade: 'XI SMA Reguler', branchId: 'br-1', parentId: 'p-10', status: 'Aktif', qrCode: 'QR-STD-110-ZAHRA' },
];

export const initialTeachers: Teacher[] = [
  { id: 'tch-1', nip: '19850112001', name: 'Bambang S., M.Pd.', subject: 'Matematika Terapan', branchId: 'br-1', hourlyRate: 150000, teachingHoursThisMonth: 42, phone: '081299887766' },
  { id: 'tch-2', nip: '19880315002', name: 'Dra. Endang Lestari', subject: 'Fisika Kuantum', branchId: 'br-2', hourlyRate: 160000, teachingHoursThisMonth: 38, phone: '081311223344' },
  { id: 'tch-3', nip: '19920720003', name: 'Kevin Sanjaya, S.Si.', subject: 'Kimia & Biologi', branchId: 'br-3', hourlyRate: 140000, teachingHoursThisMonth: 50, phone: '085644556677' },
];

export const initialPPDB: PPDBApplication[] = [
  { id: 'ppdb-1', regNumber: 'PPDB-2026-001', nisn: '0089123451', applicantName: 'Dimas Setiawan', gender: 'L', birthInfo: 'Pontianak, 14 Mei 2008', previousSchool: 'SMA Negeri 1 Pontianak', grade: 'XII SMA (Kedokteran)', parentName: 'Ibu Susanti', parentPhone: '08129876543', homeAddress: 'Jl. Sui Raya Dalam No. 15, Pontianak Tenggara', targetBranchId: 'br-1', status: 'Approved', testScore: 88, downpaymentStatus: 'Paid' },
  { id: 'ppdb-2', regNumber: 'PPDB-2026-002', nisn: '0089123452', applicantName: 'Nadia Safira', gender: 'P', birthInfo: 'Pontianak, 20 Agustus 2009', previousSchool: 'SMA Negeri 3 Pontianak', grade: 'XI SMA (Intensif)', parentName: 'Bapak Hendra', parentPhone: '08198765432', homeAddress: 'Jl. Danau Sentarum No. 44, Pontianak Kota', targetBranchId: 'br-2', status: 'Interview', testScore: 79, downpaymentStatus: 'Unpaid' },
  { id: 'ppdb-3', regNumber: 'PPDB-2026-003', nisn: '0089123453', applicantName: 'Fathan Azka', gender: 'L', birthInfo: 'Pontianak, 10 November 2010', previousSchool: 'SMP Negeri 1 Pontianak', grade: 'IX SMP (Unggulan)', parentName: 'Dr. Hendri S.', parentPhone: '08571122334', homeAddress: 'Jl. Karya Baru No. 88, Pontianak Selatan', targetBranchId: 'br-3', status: 'Pending', testScore: undefined, downpaymentStatus: 'Unpaid' },
];

export const initialInvoices: Invoice[] = [
  { id: 'inv-101', invoiceNumber: 'INV/2026/08/001', studentName: 'Rizky Pratama', branchId: 'br-1', feeType: 'SPP', amount: 1250000, dueDate: '2026-08-05', status: 'Belum Bayar' },
  { id: 'inv-102', invoiceNumber: 'INV/2026/08/002', studentName: 'Anisa Rahmawati', branchId: 'br-1', feeType: 'SPP', amount: 1250000, dueDate: '2026-08-05', status: 'Lunas', paymentMethod: 'QRIS Instant', paidAt: '2026-08-02' },
  { id: 'inv-103', invoiceNumber: 'INV/2026/08/003', studentName: 'Bagas Aditya', branchId: 'br-2', feeType: 'Uang Pangkal', amount: 7500000, dueDate: '2026-08-05', status: 'Jatuh Tempo' },
];

export const initialAttendance: AttendanceRecord[] = [
  { id: 'att-1', date: '2026-08-05', entityType: 'Siswa', entityName: 'Rizky Pratama', branchId: 'br-1', status: 'Hadir', time: '06:55 AM' },
  { id: 'att-2', date: '2026-08-05', entityType: 'Siswa', entityName: 'Anisa Rahmawati', branchId: 'br-1', status: 'Hadir', time: '07:02 AM' },
  { id: 'att-3', date: '2026-08-05', entityType: 'Guru', entityName: 'Bambang S., M.Pd.', branchId: 'br-1', status: 'Hadir', time: '06:45 AM' },
];

export const initialExams: Exam[] = [
  { id: 'ex-1', title: 'Ujian Tengah Semester - Matematika X', subject: 'Matematika', classId: 'cls-1', durationMinutes: 60, totalQuestions: 20, date: '2026-08-12', status: 'Published' },
  { id: 'ex-2', title: 'Quiz Harian - Fisika Dasar', subject: 'Fisika', classId: 'cls-1', durationMinutes: 30, totalQuestions: 10, date: '2026-08-06', status: 'Published' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-05 08:30:12', userName: 'Ahmad Faisal', userRole: 'super_admin', action: 'Create Invoice', module: 'Finance', details: 'Dibuat invoice SPP bulan Agustus 2026 untuk Cabang Serdam' },
  { id: 'log-2', timestamp: '2026-08-05 09:14:05', userName: 'Dewi Kartika', userRole: 'admin_cabang', action: 'Update Branch Status', module: 'Multi-Branch', details: 'Menyesuaikan jam operasional Cabang Karya Baru' },
];

export const initialLeads: CRMLead[] = [
  { id: 'ld-1', name: 'Orang Tua Farhan', phone: '081290909090', source: 'Instagram Ads', stage: 'Follow Up', branchId: 'br-1' },
  { id: 'ld-2', name: 'Calon Wali Murid Maya', phone: '081377889900', source: 'Website Inquiry', stage: 'Placement Test', branchId: 'br-2' },
];
