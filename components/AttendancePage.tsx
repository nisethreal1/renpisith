
import React, { useState } from 'react';
import { useApp } from '../store';
import { AttendanceStatus, AttendanceRecord } from '../types';
import { CheckCircleIcon, XCircleIcon, EnvelopeOpenIcon, LockClosedIcon, PencilIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export const AttendancePage: React.FC = () => {
  const { state, markAttendance, overrideAttendance } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(state.classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markingState, setMarkingState] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [overrideModal, setOverrideModal] = useState<{ recordId: string; studentName: string } | null>(null);

  const studentsInClass = state.students.filter(s => s.classId === selectedClassId && !s.isArchived);
  const existingAttendance = state.attendance.filter(a => a.classId === selectedClassId && a.date === selectedDate);
  const isLocked = existingAttendance.length > 0;

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    setMarkingState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulkPresent = () => {
    const bulk: Record<string, AttendanceStatus> = {};
    studentsInClass.forEach(s => bulk[s.id] = AttendanceStatus.PRESENT);
    setMarkingState(bulk);
  };

  const handleSubmit = () => {
    const records = studentsInClass.map(s => ({
      studentId: s.id,
      classId: selectedClassId,
      date: selectedDate,
      status: markingState[s.id] || AttendanceStatus.ABSENT,
      note: notes[s.id] || '',
    }));
    markAttendance(records);
    setMarkingState({});
    setNotes({});
  };

  const handleOverrideSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status') as AttendanceStatus;
    const reason = formData.get('reason') as string;
    if (overrideModal) {
      overrideAttendance(overrideModal.recordId, newStatus, reason);
      setOverrideModal(null);
    }
  };

  const selectorStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700";
  const labelStyles = "text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 space-y-1">
          <label className={labelStyles}>Select Class</label>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className={selectorStyles}
          >
            {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className={labelStyles}>Attendance Date</label>
          <div className="relative">
            <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`${selectorStyles} pl-12`}
            />
          </div>
        </div>
        {!isLocked && (
          <button 
            onClick={handleBulkPresent}
            className="px-8 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all shadow-md shadow-indigo-100/50"
          >
            All Present
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5 text-center">Attendance Status</th>
              <th className="px-8 py-5">Daily Notes</th>
              {isLocked && <th className="px-8 py-5 text-right">Edit</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentsInClass.map(student => {
              const record = existingAttendance.find(a => a.studentId === student.id);
              const currentStatus = isLocked ? record?.status : (markingState[student.id] || AttendanceStatus.ABSENT);

              return (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-800">{student.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                      {[
                        { status: AttendanceStatus.PRESENT, icon: CheckCircleIcon, active: 'bg-green-600 text-white shadow-lg shadow-green-200', inactive: 'bg-green-50 text-green-600' },
                        { status: AttendanceStatus.ABSENT, icon: XCircleIcon, active: 'bg-red-600 text-white shadow-lg shadow-red-200', inactive: 'bg-red-50 text-red-600' },
                        { status: AttendanceStatus.PERMISSION, icon: EnvelopeOpenIcon, active: 'bg-amber-600 text-white shadow-lg shadow-amber-200', inactive: 'bg-amber-50 text-amber-600' },
                      ].map(opt => (
                        <button
                          key={opt.status}
                          disabled={isLocked}
                          onClick={() => handleMark(student.id, opt.status)}
                          title={opt.status}
                          className={`p-3 rounded-2xl transition-all duration-300 transform ${
                            currentStatus === opt.status ? `${opt.active} scale-110` : `${opt.inactive} opacity-30 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105`
                          } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <opt.icon className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {isLocked ? (
                      <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl">{record?.note || '—'}</span>
                    ) : (
                      <input 
                        placeholder="Remarks..." 
                        className="text-sm bg-indigo-50/30 border-b-2 border-transparent focus:border-indigo-400 px-3 py-2 outline-none w-full transition-all rounded-t-lg focus:bg-indigo-50/60 font-medium"
                        value={notes[student.id] || ''}
                        onChange={(e) => setNotes(prev => ({ ...prev, [student.id]: e.target.value }))}
                      />
                    )}
                  </td>
                  {isLocked && (
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setOverrideModal({ recordId: record!.id, studentName: student.name })}
                        className="p-3 text-indigo-600 hover:bg-indigo-100 rounded-2xl transition-all"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {!isLocked && studentsInClass.length > 0 && (
          <div className="p-8 bg-indigo-900 border-t border-indigo-800 flex justify-end gap-6 items-center">
            <p className="text-sm text-indigo-300 font-medium mr-auto flex items-center gap-3">
              <div className="p-1.5 bg-indigo-800 rounded-lg">
                <LockClosedIcon className="w-4 h-4 text-indigo-400" />
              </div>
              Attendance records will be finalized and locked after submission.
            </p>
            <button 
              onClick={handleSubmit}
              className="px-10 py-4 bg-white text-indigo-900 rounded-[1.25rem] font-black hover:bg-indigo-50 transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit & Lock Attendance
            </button>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Admin Override</h3>
            <p className="text-sm text-slate-400 font-bold mb-8 uppercase tracking-wider">Modifying: {overrideModal.studentName}</p>
            <form onSubmit={handleOverrideSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className={labelStyles}>New Status</label>
                <select name="status" required className={selectorStyles}>
                  {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelStyles}>Reason for Change</label>
                <textarea name="reason" required className="w-full bg-indigo-50/50 border border-indigo-100 px-4 py-3 rounded-2xl h-32 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none font-medium" placeholder="Describe why this correction is being made..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setOverrideModal(null)} className="flex-1 py-4 border border-slate-200 rounded-[1.25rem] font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-100">Confirm Override</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
