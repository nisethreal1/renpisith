
import React, { useState } from 'react';
import { useApp } from '../store';
import { AttendanceStatus, PermissionStatus } from '../types';
import { 
  CalendarIcon, DocumentTextIcon, CheckBadgeIcon, XCircleIcon, ClockIcon,
  ChartPieIcon, ArrowUpRightIcon
} from '@heroicons/react/24/outline';

export const StudentDashboard: React.FC = () => {
  const { state } = useApp();
  const student = state.students.find(s => s.id === state.currentUser.studentId);
  const myAttendance = state.attendance.filter(a => a.studentId === student?.id);
  
  const presentCount = myAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
  const permissionCount = myAttendance.filter(a => a.status === AttendanceStatus.PERMISSION).length;
  const absentCount = myAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length;
  const totalDays = myAttendance.length;
  const attendanceRate = totalDays > 0 ? ((presentCount + permissionCount) / totalDays) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-10 items-center">
          <div className="w-36 h-36 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-200">
            {student?.name.charAt(0)}
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h3 className="text-3xl font-black text-slate-800">{student?.name}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-[0.15em]">Student ID: <span className="text-indigo-600 font-mono">{student?.id}</span></p>
            <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
              <span className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-[0.65rem] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Born: {student?.dob}
              </span>
              <span className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl text-[0.65rem] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" /> Class: {state.classes.find(c => c.id === student?.classId)?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 flex flex-col justify-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-30"></div>
          <p className="text-indigo-300 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">Overall Attendance</p>
          <p className="text-6xl font-black mb-2 tracking-tighter">{attendanceRate.toFixed(1)}%</p>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{presentCount + permissionCount} of {totalDays} sessions attended</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: 'Present', val: presentCount, icon: CheckBadgeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Permissions', val: permissionCount, icon: DocumentTextIcon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Absences', val: absentCount, icon: XCircleIcon, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-8 rounded-[2rem] border ${stat.border} shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all`}>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          Recent Attendance History
        </h4>
        <div className="space-y-4">
          {myAttendance.slice(-8).reverse().map(att => (
            <div key={att.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-xl shadow-sm ${
                  att.status === AttendanceStatus.PRESENT ? 'bg-emerald-600 text-white' :
                  att.status === AttendanceStatus.ABSENT ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">{new Date(att.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                  <p className={`text-[0.65rem] font-black uppercase tracking-widest mt-0.5 ${
                    att.status === AttendanceStatus.PRESENT ? 'text-emerald-600' :
                    att.status === AttendanceStatus.ABSENT ? 'text-rose-600' : 'text-amber-600'
                  }`}>{att.status}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Teacher Notes</p>
                <p className="text-sm font-medium text-slate-500 italic max-w-xs truncate">{att.note || 'No specific remarks'}</p>
              </div>
            </div>
          ))}
          {myAttendance.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <ChartPieIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest">No attendance records found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StudentPermissionPage: React.FC = () => {
  const { state, submitPermission } = useApp();
  const student = state.students.find(s => s.id === state.currentUser.studentId);
  const myRequests = state.permissions.filter(p => p.studentId === student?.id);

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitPermission({
      studentId: student!.id,
      classId: student!.classId,
      date: formData.get('date') as string,
      reason: formData.get('reason') as string,
    });
    setShowForm(false);
  };

  const inputStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-5 py-4 rounded-[1.25rem] text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder-slate-400 font-bold";
  const labelStyles = "block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-2xl font-black text-slate-800">My Requests</h3>
           <p className="text-sm text-slate-500 font-medium">Manage and track your official leave permissions</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.25rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:scale-[1.02]"
        >
          <ArrowUpRightIcon className="w-6 h-6" />
          Request Leave
        </button>
      </div>

      <div className="grid gap-6">
        {myRequests.slice().reverse().map(req => (
          <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 md:items-center group hover:shadow-md transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-[0.2em] ${
                  req.status === PermissionStatus.PENDING ? 'bg-amber-100 text-amber-700 shadow-sm' :
                  req.status === PermissionStatus.APPROVED ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-rose-100 text-rose-700 shadow-sm'
                }`}>
                  {req.status}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(req.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xl font-black text-slate-800 mb-2">Leave for: {req.date}</p>
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                 <p className="text-sm text-indigo-700 font-medium leading-relaxed italic">"{req.reason}"</p>
              </div>
            </div>
            {req.teacherComment && (
              <div className="flex-1 bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative">
                <div className="absolute top-4 right-4 text-indigo-400 opacity-20"><DocumentTextIcon className="w-12 h-12" /></div>
                <p className="text-[0.65rem] uppercase font-black text-indigo-400 tracking-[0.3em] mb-3">Administrator Feedback</p>
                <p className="text-sm text-indigo-50 font-medium leading-relaxed">{req.teacherComment}</p>
              </div>
            )}
          </div>
        ))}
        {myRequests.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
             <DocumentTextIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No permission requests history found.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
               <div className="p-2 bg-indigo-600 rounded-xl text-white">
                 <ArrowUpRightIcon className="w-6 h-6" />
               </div>
               New Leave Request
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className={labelStyles}>Expected Date of Absence</label>
                <input name="date" type="date" required className={inputStyles} />
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Detailed Reason</label>
                <textarea name="reason" required className={`${inputStyles} h-40 resize-none font-medium`} placeholder="Briefly explain why you need leave (Medical, Family, Official, etc.)..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 border border-slate-200 rounded-[1.25rem] font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
