import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Calendar, DoorOpen, 
  Plus, MoreVertical, Building2, MapPin, AlertCircle, FileText
} from 'lucide-react';
import { ApplicationItem } from '../types';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const statuses: Array<ApplicationItem['status']> = [
    'Saved', 'Analyzing', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: number, newStatus: ApplicationItem['status']) => {
    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-800 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Management
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            My Applications Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track applications across TECHKNOW 2026 employers and platform opportunities.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono self-start sm:self-auto">
          Active Opportunities: <strong className="text-white">{applications.length}</strong>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {['Saved', 'Applied', 'Interview', 'Offer'].map((colStatus) => {
          const colApps = applications.filter(a => a.status.toLowerCase() === colStatus.toLowerCase());
          return (
            <div
              key={colStatus}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col space-y-3 min-h-[400px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {colStatus}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-sky-400 flex items-center justify-center font-mono">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 shadow hover:border-sky-500/40 transition"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-['Outfit'] leading-snug">
                        {app.job_title}
                      </h4>
                      <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{app.company_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{app.location}</span>
                    </div>

                    {app.techknow_room && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        <DoorOpen className="w-3 h-3 text-amber-400" />
                        Job Fair Room: {app.techknow_room}
                      </div>
                    )}

                    {app.notes && (
                      <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 italic">
                        "{app.notes}"
                      </div>
                    )}

                    {/* Quick Move Status Selector */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">Move:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-lg">
                    No applications in {colStatus}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
