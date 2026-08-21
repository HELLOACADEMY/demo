'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Role, Branch, Student, Teacher, PPDBApplication, Invoice, AttendanceRecord, Exam, AuditLog, CRMLead,
  initialBranches, initialStudents, initialTeachers, initialPPDB, initialInvoices, initialAttendance, initialExams, initialAuditLogs, initialLeads
} from '@/lib/store';

interface ERPContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (b: boolean) => void;
  logout: () => void;
  currentRole: Role;
  setCurrentRole: (r: Role) => void;
  currentTeacherId: string;
  setCurrentTeacherId: (id: string) => void;
  activeTeacher: Teacher;
  isSuperAdmin: boolean;
  currentBranchId: string;
  setCurrentBranchId: React.Dispatch<React.SetStateAction<string>>;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  ppdbList: PPDBApplication[];
  setPpdbList: React.Dispatch<React.SetStateAction<PPDBApplication[]>>;
  attendanceLogs: AttendanceRecord[];
  setAttendanceLogs: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  exams: Exam[];
  auditLogs: AuditLog[];
  leads: CRMLead[];
  filteredStudents: Student[];
  filteredTeachers: Teacher[];
  filteredInvoices: Invoice[];
  filteredPpdbList: PPDBApplication[];
  filteredAttendanceLogs: AttendanceRecord[];
  filteredLeads: CRMLead[];
  addAuditLog: (action: string, module: string, details: string) => Promise<void>;
  payInvoice: (id: string, method: string) => Promise<void>;
  addStudent: (s: Omit<Student, 'id' | 'qrCode'>) => Promise<void>;
  addTeacher: (t: Omit<Teacher, 'id'>) => Promise<void>;
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bsmart_erp_logged_in') === 'true' || localStorage.getItem('hello_erp_logged_in') === 'true';
    }
    return false;
  });

  const [currentRole, setCurrentRoleState] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      const saved = (localStorage.getItem('bsmart_erp_role') || localStorage.getItem('hello_erp_role')) as Role;
      if (saved) return saved;
    }
    return 'super_admin';
  });

  const [currentTeacherId, setCurrentTeacherIdState] = useState<string>('tch-1');
  const [currentBranchId, setCurrentBranchId] = useState<string>('ALL');

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

  const activeTeacher = teachers.find(t => t.id === currentTeacherId) || teachers[0] || initialTeachers[0];

  const setCurrentTeacherId = (id: string) => {
    setCurrentTeacherIdState(id);
    const tch = teachers.find(t => t.id === id);
    if (tch) {
      setCurrentBranchId(tch.branchId);
    }
  };

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    if (typeof window !== 'undefined') {
      if (auth) {
        localStorage.setItem('bsmart_erp_logged_in', 'true');
      } else {
        localStorage.removeItem('bsmart_erp_logged_in');
        localStorage.removeItem('hello_erp_logged_in');
      }
    }
  };

  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bsmart_erp_role', role);
    }
    if (role !== 'super_admin' && currentBranchId === 'ALL') {
      setCurrentBranchId('br-1');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [ppdbList, setPpdbList] = useState<PPDBApplication[]>(initialPPDB);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(initialAttendance);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [leads, setLeads] = useState<CRMLead[]>(initialLeads);

  const refreshAllData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const fetchOptions = { signal: controller.signal };

      const [
        resBranches,
        resStudents,
        resTeachers,
        resInvoices,
        resPpdb,
        resAttendance,
        resExams,
        resAuditLogs,
        resLeads,
      ] = await Promise.allSettled([
        fetch('/api/branches', fetchOptions).then(res => res.json()),
        fetch('/api/students', fetchOptions).then(res => res.json()),
        fetch('/api/teachers', fetchOptions).then(res => res.json()),
        fetch('/api/finance/invoices', fetchOptions).then(res => res.json()),
        fetch('/api/ppdb', fetchOptions).then(res => res.json()),
        fetch('/api/attendance', fetchOptions).then(res => res.json()),
        fetch('/api/exams', fetchOptions).then(res => res.json()),
        fetch('/api/audit-log', fetchOptions).then(res => res.json()),
        fetch('/api/crm/leads', fetchOptions).then(res => res.json()),
      ]);

      clearTimeout(timeoutId);

      if (resBranches.status === 'fulfilled' && resBranches.value?.success && resBranches.value?.data?.length > 0) {
        setBranches(resBranches.value.data);
      }

      if (resStudents.status === 'fulfilled' && resStudents.value?.success && resStudents.value?.data?.length > 0) {
        setStudents(resStudents.value.data);
      }

      if (resTeachers.status === 'fulfilled' && resTeachers.value?.success && resTeachers.value?.data?.length > 0) {
        setTeachers(resTeachers.value.data);
      }

      if (resInvoices.status === 'fulfilled' && resInvoices.value?.success && resInvoices.value?.data?.length > 0) {
        setInvoices(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resInvoices.value.data.map((inv: any) => ({
            ...inv,
            feeType: inv.feeType === 'Uang_Pangkal' ? 'Uang Pangkal' : inv.feeType,
            status: inv.status === 'Belum_Bayar' ? 'Belum Bayar' : inv.status === 'Jatuh_Tempo' ? 'Jatuh Tempo' : inv.status,
            amount: Number(inv.amount),
          }))
        );
      }

      if (resPpdb.status === 'fulfilled' && resPpdb.value?.success && resPpdb.value?.data?.length > 0) {
        setPpdbList(resPpdb.value.data);
      }

      if (resAttendance.status === 'fulfilled' && resAttendance.value?.success && resAttendance.value?.data?.length > 0) {
        setAttendanceLogs(resAttendance.value.data);
      }

      if (resExams.status === 'fulfilled' && resExams.value?.success && resExams.value?.data?.length > 0) {
        setExams(resExams.value.data);
      }

      if (resAuditLogs.status === 'fulfilled' && resAuditLogs.value?.success && resAuditLogs.value?.data?.length > 0) {
        setAuditLogs(resAuditLogs.value.data);
      }

      if (resLeads.status === 'fulfilled' && resLeads.value?.success && resLeads.value?.data?.length > 0) {
        setLeads(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resLeads.value.data.map((ld: any) => ({
            ...ld,
            stage: ld.stage === 'Lead_Baru' ? 'Lead Baru' : ld.stage === 'Placement_Test' ? 'Placement Test' : ld.stage === 'Follow_Up' ? 'Follow Up' : ld.stage,
          }))
        );
      }
    } catch (error) {
      // Fast fallback to local state store
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Branch-Filtered Computed Lists
  const filteredStudents = useMemo(() => {
    if (currentBranchId === 'ALL') return students;
    return students.filter(s => s.branchId === currentBranchId);
  }, [students, currentBranchId]);

  const filteredTeachers = useMemo(() => {
    if (currentBranchId === 'ALL') return teachers;
    return teachers.filter(t => t.branchId === currentBranchId);
  }, [teachers, currentBranchId]);

  const filteredInvoices = useMemo(() => {
    if (currentBranchId === 'ALL') return invoices;
    return invoices.filter(i => i.branchId === currentBranchId);
  }, [invoices, currentBranchId]);

  const filteredPpdbList = useMemo(() => {
    if (currentBranchId === 'ALL') return ppdbList;
    return ppdbList.filter(p => p.targetBranchId === currentBranchId);
  }, [ppdbList, currentBranchId]);

  const filteredAttendanceLogs = useMemo(() => {
    if (currentBranchId === 'ALL') return attendanceLogs;
    return attendanceLogs.filter(a => a.branchId === currentBranchId);
  }, [attendanceLogs, currentBranchId]);

  const filteredLeads = useMemo(() => {
    if (currentBranchId === 'ALL') return leads;
    return leads.filter(l => l.branchId === currentBranchId);
  }, [leads, currentBranchId]);

  const addAuditLog = async (action: string, module: string, details: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp,
      userName: currentRole === 'super_admin' ? 'Ahmad Faisal' : 'Active User',
      userRole: currentRole,
      action,
      module,
      details
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // Non-blocking background fetch with 500ms timeout
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 500);
      fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
        signal: controller.signal,
      }).then(() => clearTimeout(id)).catch(() => {});
    } catch (e) {
      // Ignore background log errors
    }
  };

  const payInvoice = async (id: string, method: string) => {
    const paidAt = new Date().toISOString().split('T')[0];
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Lunas', paymentMethod: method, paidAt } : inv));
    
    try {
      await fetch(`/api/finance/invoices/${id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method }),
      });
    } catch (e) {
      console.error('Failed to pay invoice on MySQL:', e);
    }

    await addAuditLog('Payment Processed', 'Finance', `Invoice ${id} dibayar via ${method}`);
  };

  const addStudent = async (s: Omit<Student, 'id' | 'qrCode'>) => {
    const tempId = `std-${Date.now()}`;
    const qrCode = `QR-${tempId}-${s.name.toUpperCase()}`;
    const newStd: Student = { ...s, id: tempId, qrCode };
    setStudents(prev => [newStd, ...prev]);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nisn: s.nisn,
          name: s.name,
          gender: s.gender,
          grade: s.grade,
          branchId: s.branchId,
          parentId: s.parentId,
          status: s.status,
          qrCode,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStudents(prev => prev.map(item => item.id === tempId ? data.data : item));
      }
    } catch (e) {
      console.error('Failed to add student to MySQL:', e);
    }

    await addAuditLog('Add Student', 'Students', `Siswa baru ${s.name} berhasil ditambahkan`);
  };

  const addTeacher = async (t: Omit<Teacher, 'id'>) => {
    const tempId = `tch-${Date.now()}`;
    const newTch: Teacher = { ...t, id: tempId };
    setTeachers(prev => [newTch, ...prev]);

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nip: t.nip,
          name: t.name,
          subject: t.subject,
          branchId: t.branchId,
          hourlyRate: t.hourlyRate,
          teachingHoursThisMonth: t.teachingHoursThisMonth,
          phone: t.phone,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTeachers(prev => prev.map(item => item.id === tempId ? data.data : item));
      }
    } catch (e) {
      console.error('Failed to add teacher to MySQL:', e);
    }

    await addAuditLog('Add Teacher', 'Tutors', `Guru baru ${t.name} (${t.subject}) berhasil ditambahkan`);
  };

  const addAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    const tempId = `att-${Date.now()}`;
    const newAtt: AttendanceRecord = { ...record, id: tempId };
    setAttendanceLogs(prev => [newAtt, ...prev]);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: record.date,
          entityType: record.entityType,
          entityName: record.entityName,
          branchId: record.branchId,
          status: record.status,
          time: record.time,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAttendanceLogs(prev => prev.map(item => item.id === tempId ? data.data : item));
      }
    } catch (e) {
      console.error('Failed to add attendance record to MySQL:', e);
    }

    await addAuditLog('QR Attendance Scan', 'Attendance', `Scan QR ${record.entityName} - Status: ${record.status}`);
  };

  return (
    <ERPContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        logout,
        currentRole,
        setCurrentRole,
        currentTeacherId,
        setCurrentTeacherId,
        activeTeacher,
        isSuperAdmin: currentRole === 'super_admin',
        currentBranchId,
        setCurrentBranchId,
        branches,
        setBranches,
        students,
        setStudents,
        teachers,
        setTeachers,
        invoices,
        setInvoices,
        ppdbList,
        setPpdbList,
        attendanceLogs,
        setAttendanceLogs,
        exams,
        auditLogs,
        leads,
        filteredStudents,
        filteredTeachers,
        filteredInvoices,
        filteredPpdbList,
        filteredAttendanceLogs,
        filteredLeads,
        addAuditLog,
        payInvoice,
        addStudent,
        addTeacher,
        addAttendance,
        refreshAllData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const ctx = useContext(ERPContext);
  if (!ctx) throw new Error('useERP must be used within ERPProvider');
  return ctx;
};
