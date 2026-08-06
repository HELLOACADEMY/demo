'use client';

import React, { useState } from 'react';
import { Target, Plus, Phone, ArrowRight, UserCheck, CheckCircle, ChevronRight } from 'lucide-react';
import { useERP } from '@/context/ERPContext';
import { CRMLead } from '@/lib/store';

export default function CRMPage() {
  const { leads, branches, addAuditLog, isSuperAdmin } = useERP();
  const [showModal, setShowModal] = useState(false);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(leads);

  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    source: 'Instagram Ads',
    targetBranchId: branches[0]?.id || 'br-1'
  });

  const stages = ['Lead Baru', 'Follow Up', 'Placement Test', 'Diterima'];

  const advanceStage = (leadId: string) => {
    setCrmLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const nextStage = l.stage === 'Lead Baru' ? 'Follow Up' : l.stage === 'Follow Up' ? 'Placement Test' : 'Diterima';
        addAuditLog('CRM Lead Stage Advance', 'CRM', `Prospek ${l.name} dipindahkan ke tahap ${nextStage}`);
        return { ...l, stage: nextStage };
      }
      return l;
    }));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;
    const created: CRMLead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      phone: newLead.phone,
      source: newLead.source,
      stage: 'Lead Baru',
      branchId: newLead.targetBranchId
    };
    setCrmLeads(prev => [created, ...prev]);
    addAuditLog('Create CRM Lead', 'CRM', `Prospek baru ${newLead.name} (${newLead.source}) berhasil ditambahkan`);
    setShowModal(false);
    setNewLead({ name: '', phone: '', source: 'Instagram Ads', targetBranchId: branches[0]?.id || 'br-1' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target style={{ color: '#2575b9' }} /> Pipeline Prospek CRM Kanban Board
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Manajemen calon siswa (prospective leads), follow-up marketing WhatsApp, placement test, dan konversi registrasi.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Prospek Lead Baru
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stages.map((stg, idx) => {
          const leadsInStage = crmLeads.filter(l => l.stage === stg);
          return (
            <div key={idx} style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{stg}</span>
                <span className="badge badge-primary">{leadsInStage.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leadsInStage.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>Kosong</div>
                ) : (
                  leadsInStage.map(l => {
                    const brName = branches.find(b => b.id === l.branchId)?.name || 'Serdam Pusat';
                    return (
                      <div key={l.id} style={{ padding: '14px', background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{l.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 8px' }}>
                          📞 {l.phone} • <span style={{ color: '#2575b9', fontWeight: 500 }}>{l.source}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{brName}</span>
                          {stg !== 'Diterima' && (
                            <button
                              onClick={() => advanceStage(l.id)}
                              style={{ background: 'none', border: 'none', color: '#2575b9', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                            >
                              Lanjut <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FORM MODAL KELOLA LEAD BARU */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateLead} style={{ width: '100%', maxWidth: '440px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Input Prospek Lead Baru</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nama Calon Siswa / Wali *</label>
                <input type="text" placeholder="Masukkan nama" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} required className="input-field" />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nomor WhatsApp *</label>
                <input type="text" placeholder="08xxxxxxxxxx" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} required className="input-field" />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Sumber Prospek (Marketing) *</label>
                <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })} className="select-field">
                  <option value="Instagram Ads">Instagram Ads / Medsos</option>
                  <option value="Brosur Cabang">Brosur / Spanduk Cabang</option>
                  <option value="Rekomendasi Siswa">Rekomendasi Siswa / Teman</option>
                  <option value="Website Official">Website Official</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Target Cabang Hello Academy *</label>
                <select value={newLead.targetBranchId} onChange={e => setNewLead({ ...newLead, targetBranchId: e.target.value })} className="select-field">
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Simpan Prospek Lead</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
