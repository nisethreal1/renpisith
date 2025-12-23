
import React from 'react';
import { useApp } from '../store';
import { AttendanceStatus, PermissionStatus } from '../types';
import { UsersIcon, AcademicCapIcon, ClipboardDocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export const DashboardTeacher: React.FC = () => {
  const { state } = useApp();
  
  const totalStudents = state.students.filter(s => !s.isArchived).length;
  const activeClasses = state.classes.filter(c => c.isActive).length;
  const pendingRequests = state.permissions.filter(p => p.status === PermissionStatus.PENDING).length;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = state.attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
  const attendanceRate = todayAttendance.length > 0 ? (presentCount / todayAttendance.length) * 100 : 0;

  // Chart data: Attendance Trend (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    const dayAtt = state.attendance.filter(a => a.date === ds);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      present: dayAtt.filter(a => a.status === AttendanceStatus.PRESENT).length,
      absent: dayAtt.filter(a => a.status === AttendanceStatus.ABSENT).length,
    };
  });

  const pieData = [
    { name: 'Present', value: todayAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length || 1 },
    { name: 'Absent', value: todayAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length },
    { name: 'Permission', value: todayAttendance.filter(a => a.status === AttendanceStatus.PERMISSION).length },
  ];
  const COLORS = ['#6366f1', '#f43f5e', '#fbbf24'];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', val: totalStudents, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Classes', val: activeClasses, icon: AcademicCapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Daily Attendance', val: `${attendanceRate.toFixed(1)}%`, icon: ClipboardDocumentCheckIcon, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Requests', val: pendingRequests, icon: ClockIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Trends (Weekly)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="present" name="Present" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-6 self-start">Today's Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full mt-4">
            {pieData.map((entry, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-bold" style={{ color: COLORS[i] }}>{entry.value}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">{entry.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Permission Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.permissions.slice(-5).reverse().map(req => {
                const std = state.students.find(s => s.id === req.studentId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">{std?.name}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 truncate max-w-xs">{req.reason}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        req.status === PermissionStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                        req.status === PermissionStatus.APPROVED ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {state.permissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-400 italic">No recent requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
