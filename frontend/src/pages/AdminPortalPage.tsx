import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Building2, 
  History, Edit2, Save, ExternalLink 
} from 'lucide-react';
import { TechknowCompanyItem } from '../types';

export const AdminPortalPage: React.FC = () => {
  const [companies, setCompanies] = useState<TechknowCompanyItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<TechknowCompanyItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>('VERIFIED');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [compRes, logRes] = await Promise.all([
        fetch('/api/techknow/companies'),
        fetch('/api/admin/audit-logs')
      ]);
      const compData = await compRes.json();
      const logData = await logRes.json();
      setCompanies(compData);
      setAuditLogs(logData);
      if (compData.length > 0) {
        setSelectedCompany(compData[0]);
        setNewStatus(compData[0].verification_status);
        setAdminNotes(compData[0].verified_information.notes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVerification = async () => {
    if (!selectedCompany) return;
    try {
      await fetch(`/api/admin/verify-company/${selectedCompany.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_status: newStatus,
          notes: adminNotes
        })
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/70 px-2.5 py-0.5 rounded-full border border-rose-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrative Governance
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Admin Governance & Verification Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage company verifications, event sheet accuracy, auditorium room assignments, and audit trails.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800 self-start sm:self-auto">
          Admin Session Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Company List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            TECHKNOW 2026 Employers ({companies.length})
          </h2>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {companies.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCompany(c);
                  setNewStatus(c.verification_status);
                  setAdminNotes(c.verified_information.notes || '');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1 ${
                  selectedCompany?.id === c.id
                    ? 'bg-slate-850 border-sky-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{c.name}</span>
                  <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                    c.verification_status === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {c.verification_status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Room: {c.event_information.room}</span>
                  <span>{c.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Verification Editor & Audit Log */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCompany && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Edit Verification: {selectedCompany.name}
                </h3>
                <div className="text-xs text-slate-400">
                  Sheet #{selectedCompany.sheet_num} • Auditorium Room {selectedCompany.event_information.room}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Verification Label:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="EVENT SHEET">EVENT SHEET (From Job Fair master list only)</option>
                    <option value="VERIFIED">VERIFIED (Independently confirmed via ROC/Official site)</option>
                    <option value="NOT VERIFIED">NOT VERIFIED (Unsubstantiated)</option>
                    <option value="CONFLICT">CONFLICT (Data disparity detected)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Auditor Notes & Grounding Citations:
                  </label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <button
                  onClick={handleUpdateVerification}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Commit Verification & Log Audit Trail</span>
                </button>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" /> Administrative Audit Trail
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {auditLogs.map((l) => (
                <div key={l.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{l.action}</span>
                    <span className="text-slate-500 font-mono">{l.timestamp}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{l.details}</div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-slate-500 text-center py-4">No audit logs recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
