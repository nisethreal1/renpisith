
import React, { useState } from 'react';
import { useApp } from '../store';
import { AttendanceStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const ReportsPage: React.FC = () => {
  const { state } = useApp();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedClassId, setSelectedClassId] = useState(state.classes[0]?.id || 'all');

  const filteredAttendance = state.attendance.filter(a => selectedClassId === 'all' || a.classId === selectedClassId);

  // Group data for chart
  const getChartData = () => {
    const data: any[] = [];
    const dateMap: Record<string, { present: number; absent: number; permission: number }> = {};

    filteredAttendance.forEach(a => {
      if (!dateMap[a.date]) dateMap[a.date] = { present: 0, absent: 0, permission: 0 };
      if (a.status === AttendanceStatus.PRESENT) dateMap[a.date].present++;
      else if (a.status === AttendanceStatus.ABSENT) dateMap[a.date].absent++;
      else dateMap[a.date].permission++;
    });

    Object.entries(dateMap).sort().forEach(([date, counts]) => {
      data.push({ date, ...counts });
    });

    return data.slice(-30); // Last 30 dates
  };

  const chartData = getChartData();

  const exportCSV = () => {
    const headers = ['Date', 'Student ID', 'Student Name', 'Class', 'Status', 'Notes'];
    const rows = filteredAttendance.map(a => {
      const student = state.students.find(s => s.id === a.studentId);
      const cls = state.classes.find(c => c.id === a.classId);
      return [a.date, a.studentId, student?.name, cls?.name, a.status, a.note || ''];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
  };

  const selectStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-5 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm";
  const labelStyles = "block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2";

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 space-y-1">
          <label className={labelStyles}>Filter by Group</label>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className={selectStyles}
          >
            <option value="all">All Academic Groups</option>
            {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className={labelStyles}>Aggregation Level</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value as any)} className={selectStyles}>
            <option value="daily">Daily Snapshot</option>
            <option value="weekly">Weekly Progress</option>
            <option value="monthly">Monthly Overview</option>
          </select>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-[1.25rem] font-black hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
          Export Spreadsheet
        </button>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-4">
           <div className="w-3 h-8 bg-indigo-600 rounded-full"></div>
           Enrollment Performance Trend
        </h3>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }} 
                contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '1.5rem' }}
              />
              <Legend verticalAlign="top" height={60} iconType="circle" wrapperStyle={{ paddingBottom: '2rem', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Bar dataKey="present" name="Present" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="permission" name="Permission" fill="#fbbf24" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#f43f5e" stackId="a" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-800">Historical Log Data</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">Numerical breakdown of records per session</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.2em]">
              <th className="px-10 py-6">Date</th>
              <th className="px-10 py-6">Academic Group</th>
              <th className="px-10 py-6 text-center">Present</th>
              <th className="px-10 py-6 text-center">Absent</th>
              <th className="px-10 py-6">Success Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chartData.reverse().map((d, i) => {
              const total = d.present + d.absent + d.permission;
              const rate = total > 0 ? ((d.present / total) * 100).toFixed(1) : "0.0";
              const rateNum = parseFloat(rate);

              return (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6 text-sm font-black text-slate-800">{d.date}</td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      {selectedClassId === 'all' ? 'Unified View' : state.classes.find(c => c.id === selectedClassId)?.name}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center text-emerald-600 font-black text-lg">{d.present}</td>
                  <td className="px-10 py-6 text-center text-rose-500 font-black text-lg">{d.absent}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full transition-all duration-1000 ${rateNum > 80 ? 'bg-emerald-500' : rateNum > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${rate}%` }} />
                      </div>
                      <span className="font-black text-slate-800 text-sm tracking-tighter">{rate}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
