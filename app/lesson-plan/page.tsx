'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { 
  BookOpen, Plus, Search, Calendar, Clock, User, CheckCircle2, 
  XCircle, Edit3, Printer, FileText, CheckSquare, Sparkles, Filter, ChevronRight, Save
} from 'lucide-react';

interface LessonPlanItem {
  id: string;
  meetingNo: number;
  tutor: string;
  studentClass: string;
  date: string;
  timeSlot: string;
  learningGoal: string;
  anticipatedProblem: string;
  solution: string;
  materials: string;
  openingActivity: { description: string; durationMinutes: number };
  mainActivities: { description: string; durationMinutes: number }[];
  closingActivity: { description: string; durationMinutes: number };
  // Evaluation section (filled after class)
  evalGoalAchieved: boolean | null;
  evalStepsCompleted: boolean | null;
  evalImprovementNext: string;
  evalActionPlan: string;
  studentUnderstanding: 'sangat_tinggi' | 'tinggi' | 'rata_rata' | 'rendah' | 'sangat_rendah' | null;
  status: 'pra_kelas' | 'selesai_dievaluasi';
}

const initialLessonPlans: LessonPlanItem[] = [
  {
    id: 'LP-003',
    meetingNo: 3,
    tutor: 'Lukas',
    studentClass: 'private filbert',
    date: '2026-08-18',
    timeSlot: '19.00 - 20.00',
    learningGoal: 'PD dapat memahami dasar dasar goresan',
    anticipatedProblem: 'Kesalahan PD dalam penulisan',
    solution: 'Tutor memperbaiki kesalahan penulisan',
    materials: 'video, flashcard.',
    openingActivity: { description: 'Kegiatan pembuka: 复习 (Review kosakata sebelumnya)', durationMinutes: 10 },
    mainActivities: [
      { description: 'menjelaskan goresan goresan dasar', durationMinutes: 15 },
      { description: 'lanjut mengerjakan 联系', durationMinutes: 10 },
      { description: 'pd membaca 联系 yang dia kerjakan', durationMinutes: 10 },
      { description: 'latihan dikte dan urutan stroke (Bishun)', durationMinutes: 10 },
    ],
    closingActivity: { description: 'Kegiatan penutup: test kedepan', durationMinutes: 5 },
    evalGoalAchieved: true,
    evalStepsCompleted: true,
    evalImprovementNext: 'Penguasaan urutan goresan Hanzi pada karakter kompleks perlu latihan menulis lebih banyak di buku kotak.',
    evalActionPlan: 'Diberikan lembar latihan stroke order 5 karakter baru di awal sesi berikutnya.',
    studentUnderstanding: 'tinggi',
    status: 'selesai_dievaluasi'
  },
  {
    id: 'LP-004',
    meetingNo: 4,
    tutor: 'Bambang S., M.Pd.',
    studentClass: '12 IPA 1 - Intensif UTBK',
    date: '2026-08-22',
    timeSlot: '15.30 - 17.00',
    learningGoal: 'Siswa mampu menyelesaikan 15 soal Penalaran Matematika UTBK tipe HOTS.',
    anticipatedProblem: 'Siswa kebingungan pada konsep transformasi fungsi & aljabar linier.',
    solution: 'Memberikan trik cepat eliminasi opsi jawaban dan pemeta skema rumus.',
    materials: 'Modul Intensif Bab 4, Tablet Digital CBT, Quizizz Online.',
    openingActivity: { description: 'Review singkat 3 soal tryout minggu lalu & motivasi strategi skor UTBK', durationMinutes: 15 },
    mainActivities: [
      { description: 'Pembahasan 5 Soal Penalaran Kuantitatif pilihan HOTS', durationMinutes: 30 },
      { description: 'Drill Soal mandiri dengan timer CBT (10 Soal)', durationMinutes: 25 },
      { description: 'Pembahasan cepat pola jebakan soal', durationMinutes: 15 },
    ],
    closingActivity: { description: 'Refleksi poin kunci & pembagian tugas mandiri di portal siswa', durationMinutes: 5 },
    evalGoalAchieved: null,
    evalStepsCompleted: null,
    evalImprovementNext: '',
    evalActionPlan: '',
    studentUnderstanding: null,
    status: 'pra_kelas'
  }
];

export default function LessonPlanPage() {
  const { currentRole } = useERP();
  const [plans, setPlans] = useState<LessonPlanItem[]>(initialLessonPlans);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlanItem>(initialLessonPlans[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'editor' | 'official_print'>('official_print');

  // Form state for creating / editing lesson plan
  const [formData, setFormData] = useState<LessonPlanItem>({
    id: `LP-00${plans.length + 1}`,
    meetingNo: 5,
    tutor: 'Lukas',
    studentClass: 'private filbert',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '16.00 - 17.00',
    learningGoal: '',
    anticipatedProblem: '',
    solution: '',
    materials: '',
    openingActivity: { description: 'Kegiatan pembuka: ', durationMinutes: 10 },
    mainActivities: [
      { description: 'Penjelasan materi inti', durationMinutes: 20 },
      { description: 'Latihan soal & diskusi', durationMinutes: 20 },
    ],
    closingActivity: { description: 'Kegiatan penutup: Evaluasi & penugasan', durationMinutes: 10 },
    evalGoalAchieved: true,
    evalStepsCompleted: true,
    evalImprovementNext: '',
    evalActionPlan: '',
    studentUnderstanding: 'tinggi',
    status: 'pra_kelas'
  });

  const filteredPlans = plans.filter(p => 
    p.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.studentClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.learningGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEvaluation = () => {
    setPlans(prev => prev.map(p => p.id === selectedPlan.id ? { ...selectedPlan, status: 'selesai_dievaluasi' } : p));
    alert('Lembar evaluasi sesi berhasil disimpan ke sistem ERP!');
  };

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: LessonPlanItem = {
      ...formData,
      id: `LP-00${plans.length + 1}`
    };
    setPlans([newPlan, ...plans]);
    setSelectedPlan(newPlan);
    setIsCreatingModal(false);
    alert('Lesson Plan per sesi berhasil dibuat!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Manrope', sans-serif" }}>

      {/* 🚀 SCREEN-ONLY TOP HEADER & ACTIONS */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen style={{ color: '#7c3aed' }} size={28} /> Lesson Plan & Lembar Evaluasi Sesi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Perencanaan pembelajaran per sesi (diisi guru sebelum kelas) & evaluasi hasil belajar (diisi di akhir kelas).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsCreatingModal(true)} 
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Buat Lesson Plan Baru
          </button>
          <button 
            onClick={handlePrint} 
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} /> Cetak Form Lesson Plan PDF
          </button>
        </div>
      </div>


      {/* 📍 MAIN CONTENT SPLIT GRID (SCREEN VIEW) */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: LIST OF LESSON PLANS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Cari tutor, kelas, materi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', fontSize: '0.825rem' }}
              />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
              Daftar Lesson Plan ({filteredPlans.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                      background: isSelected ? '#f5f3ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#7c3aed', background: '#ede9fe', padding: '2px 8px', borderRadius: '6px' }}>
                        BAB / PERTEMUAN {plan.meetingNo}
                      </span>
                      <span style={{
                        fontSize: '0.675rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        background: plan.status === 'selesai_dievaluasi' ? '#dcfce7' : '#fef3c7',
                        color: plan.status === 'selesai_dievaluasi' ? '#166534' : '#92400e'
                      }}>
                        {plan.status === 'selesai_dievaluasi' ? 'Dievaluasi' : 'Pra-Kelas'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                      {plan.studentClass}
                    </div>

                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} /> Tutor: {plan.tutor}
                    </div>

                    <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} /> {plan.date} | <Clock size={12} /> {plan.timeSlot}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & FORM EDITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* TOGGLE VIEW MODE SWITCHER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '12px 20px', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveViewMode('official_print')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  background: activeViewMode === 'official_print' ? '#7c3aed' : '#f1f5f9',
                  color: activeViewMode === 'official_print' ? '#ffffff' : '#64748b'
                }}
              >
                📄 Form Resmi Lesson Plan (Prinj/PDF)
              </button>
              <button
                onClick={() => setActiveViewMode('editor')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  background: activeViewMode === 'editor' ? '#7c3aed' : '#f1f5f9',
                  color: activeViewMode === 'editor' ? '#ffffff' : '#64748b'
                }}
              >
                ✏️ Isu Lembar Evaluasi Sesi
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
              ID Dokumen: <strong>{selectedPlan.id}</strong>
            </div>
          </div>

          {/* VIEW MODE A: OFFICIAL FORM DOCUMENT REPLICA */}
          {activeViewMode === 'official_print' && (
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
              {/* Note banner */}
              <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', fontSize: '0.8rem', color: '#6d28d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>💡 Tampilan di bawah ini identik 100% dengan lembar kerja fisik yang dapat dicetak.</span>
                <button onClick={handlePrint} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                  Cetak PDF
                </button>
              </div>

              {/* Render Official Form Box */}
              <RenderOfficialLessonPlanDocument plan={selectedPlan} />
            </div>
          )}

          {/* VIEW MODE B: EVALUATION EDITOR FORM */}
          {activeViewMode === 'editor' && (
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Pengisian Lembar Evaluasi Sesi ({selectedPlan.studentClass} - Pertemuan {selectedPlan.meetingNo})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                  Guru/Tutor mengisi lembar evaluasi ini di akhir sesi pembelajaran.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Apakah tujuan pembelajaran terlaksana?
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="evalGoal" 
                        checked={selectedPlan.evalGoalAchieved === true} 
                        onChange={() => setSelectedPlan({ ...selectedPlan, evalGoalAchieved: true })}
                      /> Ya
                    </label>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="evalGoal" 
                        checked={selectedPlan.evalGoalAchieved === false} 
                        onChange={() => setSelectedPlan({ ...selectedPlan, evalGoalAchieved: false })}
                      /> Tidak
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Apakah setiap tahap terlaksana?
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="evalSteps" 
                        checked={selectedPlan.evalStepsCompleted === true} 
                        onChange={() => setSelectedPlan({ ...selectedPlan, evalStepsCompleted: true })}
                      /> Ya
                    </label>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="evalSteps" 
                        checked={selectedPlan.evalStepsCompleted === false} 
                        onChange={() => setSelectedPlan({ ...selectedPlan, evalStepsCompleted: false })}
                      /> Tidak
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Apa yang bisa ditingkatkan di pertemuan berikutnya?
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={selectedPlan.evalImprovementNext}
                  onChange={e => setSelectedPlan({ ...selectedPlan, evalImprovementNext: e.target.value })}
                  placeholder="Catatan evaluasi area yang perlu ditingkatkan..."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Bagaimana pertemuan berikutnya bisa ditingkatkan dengan cara di atas?
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={selectedPlan.evalActionPlan}
                  onChange={e => setSelectedPlan({ ...selectedPlan, evalActionPlan: e.target.value })}
                  placeholder="Langkah solusi / materi tambahan untuk sesi berikutnya..."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Pemahaman PD (Peserta Didik):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {[
                    { id: 'sangat_tinggi', label: 'sangat tinggi' },
                    { id: 'tinggi', label: 'tinggi' },
                    { id: 'rata_rata', label: 'rata-rata' },
                    { id: 'rendah', label: 'rendah' },
                    { id: 'sangat_rendah', label: 'sangat rendah' },
                  ].map(item => (
                    <label key={item.id} style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: selectedPlan.studentUnderstanding === item.id ? '#ede9fe' : '#ffffff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="understanding"
                        checked={selectedPlan.studentUnderstanding === item.id}
                        onChange={() => setSelectedPlan({ ...selectedPlan, studentUnderstanding: item.id as any })}
                      /> {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={handleSaveEvaluation} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> Simpan Evaluasi Sesi
                </button>
              </div>
            </div>
          )}

        </div>

      </div>


      {/* 📄 FORMAL PRINT CONTAINER (PRINT REPLICA matching screenshot) */}
      <div className="printable-document-container">
        <RenderOfficialLessonPlanDocument plan={selectedPlan} />
      </div>


      {/* ➕ MODAL FOR CREATING NEW LESSON PLAN */}
      {isCreatingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Buat Lesson Plan Sesi Baru (Pra-Kelas)
              </h2>
              <button onClick={() => setIsCreatingModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateNewPlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Nama Tutor / Guru</label>
                  <input type="text" className="input-field" value={formData.tutor} onChange={e => setFormData({ ...formData, tutor: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Kelas / Nama Siswa</label>
                  <input type="text" className="input-field" value={formData.studentClass} onChange={e => setFormData({ ...formData, studentClass: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Bab / Pertemuan Ke</label>
                  <input type="number" className="input-field" value={formData.meetingNo} onChange={e => setFormData({ ...formData, meetingNo: parseInt(e.target.value) || 1 })} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Tanggal</label>
                  <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Waktu Sesi</label>
                  <input type="text" className="input-field" value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })} placeholder="19.00-20.00" required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Tujuan Pembelajaran</label>
                <textarea rows={2} className="input-field" value={formData.learningGoal} onChange={e => setFormData({ ...formData, learningGoal: e.target.value })} placeholder="PD dapat memahami..." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Masalah yang Diantisipasi</label>
                  <textarea rows={2} className="input-field" value={formData.anticipatedProblem} onChange={e => setFormData({ ...formData, anticipatedProblem: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Solusi</label>
                  <textarea rows={2} className="input-field" value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Materi / Sumber / Peralatan / Flashcard / dll.</label>
                <input type="text" className="input-field" value={formData.materials} onChange={e => setFormData({ ...formData, materials: e.target.value })} placeholder="video, flashcard, modul bab 3" />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsCreatingModal(false)} className="btn btn-secondary">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Lesson Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


/* ========================================================================= */
/* 📄 OFFICIAL LESSON PLAN DOCUMENT COMPONENT (Exact replica of user image)  */
/* ========================================================================= */
function RenderOfficialLessonPlanDocument({ plan }: { plan: LessonPlanItem }) {
  return (
    <div 
      className="printable-document" 
      style={{ 
        background: '#ffffff', 
        padding: '32px 36px', 
        color: '#0284c7', 
        fontFamily: "'Manrope', sans-serif",
        border: '1.5px solid #0284c7',
        maxWidth: '800px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #334155', paddingBottom: '6px', marginBottom: '16px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#334155' }}>
          Lesson Plan & Lembar Evaluasi
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Bsmart Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </div>

      {/* BAB - PERTEMUAN TITLE */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        BAB – PERTEMUAN-{plan.meetingNo}
      </h2>

      {/* GRID TABLE 1: METADATA & OBJECTIVES */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0284c7', marginBottom: '-1.5px', fontSize: '0.825rem' }}>
        <tbody>
          {/* ROW 1: METADATA */}
          <tr style={{ borderBottom: '1.5px solid #0284c7' }}>
            <td style={{ padding: '8px 10px', borderRight: '1.5px solid #0284c7', width: '22%' }}>
              <strong>Tutor :</strong> {plan.tutor}
            </td>
            <td style={{ padding: '8px 10px', borderRight: '1.5px solid #0284c7', width: '20%' }}>
              <strong>Kelas :</strong> {plan.studentClass}
            </td>
            <td style={{ padding: '8px 10px', borderRight: '1.5px solid #0284c7', width: '18%' }}>
              <strong>Bab/Pertemuan :</strong> {plan.meetingNo}
            </td>
            <td style={{ padding: '8px 10px', borderRight: '1.5px solid #0284c7', width: '20%' }}>
              <strong>Tanggal :</strong> {plan.date}
            </td>
            <td style={{ padding: '8px 10px', width: '20%' }}>
              <strong>Waktu :</strong> {plan.timeSlot}
            </td>
          </tr>

          {/* ROW 2: OBJECTIVES & ANTICIPATED PROBLEMS */}
          <tr style={{ borderBottom: '1.5px solid #0284c7' }}>
            <td colSpan={3} rowSpan={2} style={{ padding: '10px 12px', borderRight: '1.5px solid #0284c7', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>Tujuan pembelajaran :</div>
              <div style={{ color: '#0369a1', fontWeight: 700 }}>{plan.learningGoal || '-'}</div>
            </td>
            <td colSpan={2} style={{ padding: '8px 10px', borderBottom: '1.5px solid #0284c7', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800, marginBottom: '2px' }}>Masalah yang diantisipasi :</div>
              <div style={{ color: '#0369a1', fontWeight: 700 }}>{plan.anticipatedProblem || '-'}</div>
            </td>
          </tr>
          <tr style={{ borderBottom: '1.5px solid #0284c7' }}>
            <td colSpan={2} style={{ padding: '8px 10px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800, marginBottom: '2px' }}>Solusi :</div>
              <div style={{ color: '#0369a1', fontWeight: 700 }}>{plan.solution || '-'}</div>
            </td>
          </tr>

          {/* ROW 3: MATERIALS */}
          <tr>
            <td colSpan={5} style={{ padding: '8px 10px', background: '#f0f9ff' }}>
              <strong>Materi / Sumber / Peralatan / Flashcard / dll.</strong>
              <div style={{ color: '#0369a1', fontWeight: 700, marginTop: '2px' }}>{plan.materials || '-'}</div>
            </td>
          </tr>
        </tbody>
      </table>


      {/* GRID TABLE 2: TAHAPAN PEMBELAJARAN & DURASI */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0284c7', marginBottom: '20px', fontSize: '0.825rem' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #0284c7', background: '#e0f2fe', textAlign: 'center', fontWeight: 800 }}>
            <th style={{ padding: '8px 12px', borderRight: '1.5px solid #0284c7' }}>Tahapan pembelajaran</th>
            <th style={{ padding: '8px 12px', width: '130px' }}>Durasi</th>
          </tr>
        </thead>
        <tbody>
          {/* KEGIATAN PEMBUKA */}
          <tr style={{ borderBottom: '1.5px solid #0284c7' }}>
            <td style={{ padding: '10px 12px', borderRight: '1.5px solid #0284c7', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800 }}>Kegiatan pembuka:</div>
              <div style={{ color: '#0369a1', marginTop: '2px', fontWeight: 700 }}>{plan.openingActivity.description}</div>
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, verticalAlign: 'middle', borderRight: '1.5px solid #0284c7' }}>
              {plan.openingActivity.durationMinutes} menit
            </td>
          </tr>

          {/* KEGIATAN UTAMA */}
          <tr style={{ borderBottom: '1.5px solid #0284c7' }}>
            <td style={{ padding: '10px 12px', borderRight: '1.5px solid #0284c7', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>Kegiatan utama:</div>
              {plan.mainActivities.map((act, idx) => (
                <div key={idx} style={{ color: '#0369a1', marginBottom: '3px', fontWeight: 700 }}>
                  • {act.description}
                </div>
              ))}
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, verticalAlign: 'top' }}>
              {plan.mainActivities.map((act, idx) => (
                <div key={idx} style={{ marginBottom: '3px' }}>
                  {act.durationMinutes} menit
                </div>
              ))}
            </td>
          </tr>

          {/* KEGIATAN PENUTUP */}
          <tr>
            <td style={{ padding: '10px 12px', borderRight: '1.5px solid #0284c7', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 800 }}>Kegiatan penutup:</div>
              <div style={{ color: '#0369a1', marginTop: '2px', fontWeight: 700 }}>{plan.closingActivity.description}</div>
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, verticalAlign: 'middle' }}>
              {plan.closingActivity.durationMinutes} menit
            </td>
          </tr>
        </tbody>
      </table>


      {/* EVALUATION SECTION (EVALUASI PERTEMUAN) */}
      <div style={{ fontSize: '0.8rem', color: '#0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#0f172a' }}>
          <strong style={{ fontSize: '0.825rem' }}>Lembar evaluasi (harap diisi di akhir pembelajaran) :</strong>
          <strong style={{ fontSize: '0.825rem' }}>Pemahaman PD</strong>
        </div>

        {/* QUESTIONS & CHECKBOXES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px' }}>
          
          {/* LEFT: QUESTIONS & TEXT INPUT BOXES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Q1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Apakah tujuan pembelajaran terlaksana?</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SquareBox checked={plan.evalGoalAchieved === true} /> Ya
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SquareBox checked={plan.evalGoalAchieved === false} /> Tidak
                </span>
              </div>
            </div>

            {/* Q2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Apakah setiap tahap terlaksana?</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SquareBox checked={plan.evalStepsCompleted === true} /> Ya
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SquareBox checked={plan.evalStepsCompleted === false} /> Tidak
                </span>
              </div>
            </div>

            {/* Q3 BOX */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '3px' }}>Apa yang bisa ditingkatkan di pertemuan berikutnya?</div>
              <div style={{ border: '1.5px solid #0284c7', padding: '6px 10px', minHeight: '36px', borderRadius: '4px', background: '#fafafa', color: '#0369a1', fontWeight: 600 }}>
                {plan.evalImprovementNext || ''}
              </div>
            </div>

            {/* Q4 BOX */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '3px' }}>Bagaimana pertemuan berikutnya bisa ditingkatkan dengan cara di atas?</div>
              <div style={{ border: '1.5px solid #0284c7', padding: '6px 10px', minHeight: '36px', borderRadius: '4px', background: '#fafafa', color: '#0369a1', fontWeight: 600 }}>
                {plan.evalActionPlan || ''}
              </div>
            </div>

          </div>

          {/* RIGHT: PEMAHAMAN PD CHECKBOXES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            {[
              { id: 'sangat_tinggi', label: 'sangat tinggi' },
              { id: 'tinggi', label: 'tinggi' },
              { id: 'rata_rata', label: 'rata-rata' },
              { id: 'rendah', label: 'rendah' },
              { id: 'sangat_rendah', label: 'sangat rendah' },
            ].map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SquareBox checked={plan.studentUnderstanding === item.id} />
                <span style={{ fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

function SquareBox({ checked }: { checked: boolean }) {
  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '14px', 
      height: '14px', 
      border: '1.5px solid #0284c7', 
      borderRadius: '2px', 
      background: checked ? '#0284c7' : '#ffffff',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 'bold',
      lineHeight: 1
    }}>
      {checked ? '✓' : ''}
    </span>
  );
}
