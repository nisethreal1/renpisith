
import React, { useState } from 'react';
import { useApp } from '../store';
import { PermissionStatus } from '../types';
import { CheckIcon, XMarkIcon, ChatBubbleLeftEllipsisIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export const PermissionManagement: React.FC = () => {
  const { state, updatePermissionStatus } = useApp();
  const [commentModal, setCommentModal] = useState<{ id: string; status: PermissionStatus } | null>(null);

  const pending = state.permissions.filter(p => p.status === PermissionStatus.PENDING);
  const historical = state.permissions.filter(p => p.status !== PermissionStatus.PENDING);

  const handleAction = (id: string, status: PermissionStatus) => {
    setCommentModal({ id, status });
  };

  const submitAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = new FormData(e.currentTarget).get('comment') as string;
    if (commentModal) {
      updatePermissionStatus(commentModal.id, commentModal.status, comment);
      setCommentModal(null);
    }
  };

  const inputStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-5 py-4 rounded-[1.25rem] text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder-slate-400 font-bold";

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          Pending Leave Requests
        </h3>
        <div className="grid gap-6">
          {pending.map(req => {
            const student = state.students.find(s => s.id === req.studentId);
            return (
              <div key={req.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base font-black text-slate-800">{student?.name}</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold border border-indigo-100">{student?.id}</span>
                  </div>
                  <div className="text-[0.65rem] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Request for: <b className="text-slate-600">{req.date}</b> • Submitted: {new Date(req.createdAt).toLocaleDateString()}</div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{req.reason}"</p>
                  </div>
                </div>
                <div className="flex gap-3 h-fit">
                  <button 
                    onClick={() => handleAction(req.id, PermissionStatus.REJECTED)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-rose-100 text-rose-600 rounded-2xl hover:bg-rose-50 transition-all font-black text-xs uppercase tracking-widest shadow-sm"
                  >
                    <XMarkIcon className="w-5 h-5" /> Reject
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, PermissionStatus.APPROVED)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
                  >
                    <CheckIcon className="w-5 h-5" /> Approve
                  </button>
                </div>
              </div>
            );
          })}
          {pending.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <DocumentCheckIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No pending permission requests</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-2 h-6 bg-slate-300 rounded-full"></div>
          Administrative History
        </h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5">Request Date</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5">Resolution Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historical.slice().reverse().map(req => {
                const student = state.students.find(s => s.id === req.studentId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-slate-800">{student?.name}</td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-bold">{req.date}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1.5 rounded-xl text-[0.65rem] font-black uppercase tracking-widest ${
                        req.status === PermissionStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium italic truncate max-w-xs">{req.teacherComment || 'Resolved without remarks'}</td>
                  </tr>
                );
              })}
              {historical.length === 0 && <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest">No processed history found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {commentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Resolution Note</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-8">Process as: {commentModal.status}</p>
            <form onSubmit={submitAction} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Feedback for Student</label>
                 <textarea name="comment" className={`${inputStyles} h-40 resize-none`} placeholder="Add any details, instructions, or conditions for this leave resolution..." required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setCommentModal(null)} className="flex-1 py-4 border border-slate-200 rounded-[1.25rem] font-bold text-slate-500 transition-colors hover:bg-slate-50">Cancel</button>
                <button type="submit" className={`flex-1 py-4 text-white rounded-[1.25rem] font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${commentModal.status === PermissionStatus.APPROVED ? 'bg-indigo-600 shadow-indigo-100' : 'bg-rose-600 shadow-rose-100'}`}>
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
