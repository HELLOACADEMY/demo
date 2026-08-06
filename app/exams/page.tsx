'use client';

import React, { useState, useEffect } from 'react';
import { BookCheck, Clock, Award, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function ExamsPage() {
  const { exams, addAuditLog } = useERP();
  const [activeExam, setActiveExam] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examResultScore, setExamResultScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  const questions = [
    {
      q: 'Berapakah turunan pertama dari fungsi f(x) = 3x^2 + 5x - 4 ?',
      options: ['6x + 5', '3x + 5', '6x^2 + 5', '6x - 4'],
      correct: 0
    },
    {
      q: 'Hukum II Newton menyatakan hubungan antara Gaya (F), Massa (m), dan Percepatan (a). Rumus yang tepat adalah:',
      options: ['F = m / a', 'F = m × a', 'F = a / m', 'F = m + a'],
      correct: 1
    },
    {
      q: 'Unsur kimia dengan nomor atom 1 dan simbol H adalah:',
      options: ['Helium', 'Hidrogen', 'Hafnium', 'Holmium'],
      correct: 1
    }
  ];

  useEffect(() => {
    if (!activeExam) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam]);

  const startExamSession = () => {
    setActiveExam(true);
    setExamResultScore(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(900);
    addAuditLog('CBT Exam Started', 'CBT Examination', 'Siswa memulai sesi Ujian Online CBT');
  };

  const finishExam = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 33.33;
    });
    const finalScore = Math.round(score);
    setExamResultScore(finalScore);
    setActiveExam(false);
    addAuditLog('CBT Exam Finished', 'CBT Examination', `Sesi CBT Selesai dengan Nilai: ${finalScore}`);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookCheck style={{ color: '#2575b9' }} /> Computer Based Test (Engine Ujian CBT Online)
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Modul ujian online berstandar CBT dengan timer realtime, sistem kuis, dan kalkulasi nilai otomatis.
        </p>
      </div>

      {examResultScore !== null && (
        <div style={{ padding: '24px', textAlign: 'center', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '16px' }}>
          <Award size={48} style={{ color: '#166534', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.4rem', color: '#166534', fontWeight: 600 }}>Ujian Selesai! Nilai CBT Anda:</h2>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: '#166534', margin: '8px 0' }}>
            {examResultScore} / 100
          </div>
          <p style={{ fontSize: '0.85rem', color: '#15803d', margin: 0 }}>
            Nilai ujian ini telah otomatis dikirim dan direkap ke dalam E-Rapor Akademik Siswa.
          </p>
        </div>
      )}

      {!activeExam ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {exams.map(e => (
            <div key={e.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary">{e.subject}</span>
                <span className="badge badge-success">{e.status}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 600, marginBottom: '8px' }}>{e.title}</h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>⏱ Durasi: {e.durationMinutes} Menit</span>
                <span>📝 Jumlah Soal: {e.totalQuestions} Pilihan Ganda</span>
                <span>📅 Tanggal: {e.date}</span>
              </div>

              <button style={{ width: '100%', padding: '10px 16px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={startExamSession}>
                <Play size={16} /> Mulai Ujian CBT Sekarang
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active CBT Exam Runner Interface */
        <div style={{ padding: '32px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge badge-warning">Ujian Berlangsung</span>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginTop: '4px', margin: 0 }}>Soal No. {currentQuestionIdx + 1} dari {questions.length}</h2>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '8px 16px', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} /> {formatTimer(timeLeft)}
            </div>
          </div>

          <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '20px' }}>
            {questions[currentQuestionIdx].q}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {questions[currentQuestionIdx].options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: oIdx }))}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #2575b9' : '1px solid #cbd5e1',
                    background: isSelected ? '#eef2ff' : '#ffffff',
                    color: isSelected ? '#2575b9' : '#334155',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {String.fromCharCode(65 + oIdx)}. {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button
              style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            >
              ← Soal Sebelumnya
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
              >
                Soal Berikutnya →
              </button>
            ) : (
              <button style={{ padding: '10px 20px', background: '#16a34a', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} onClick={finishExam}>
                Selesai & Kumpulkan Jawaban
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
