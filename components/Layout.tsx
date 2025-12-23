
import React from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';
import { 
  HomeIcon, 
  UsersIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon, 
  EnvelopeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  icon: any;
  view: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, view: 'dashboard', roles: [UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Students', icon: UsersIcon, view: 'students', roles: [UserRole.TEACHER] },
  { name: 'Classes', icon: AcademicCapIcon, view: 'classes', roles: [UserRole.TEACHER] },
  { name: 'Attendance', icon: ClipboardDocumentCheckIcon, view: 'attendance', roles: [UserRole.TEACHER] },
  { name: 'Reports', icon: ChartBarIcon, view: 'reports', roles: [UserRole.TEACHER] },
  { name: 'My Attendance', icon: ClipboardDocumentCheckIcon, view: 'student-attendance', roles: [UserRole.STUDENT] },
  { name: 'Permissions', icon: EnvelopeIcon, view: 'permissions', roles: [UserRole.TEACHER, UserRole.STUDENT] },
];

export const Layout: React.FC<{ activeView: string; onViewChange: (view: string) => void; children: React.ReactNode }> = ({ activeView, onViewChange, children }) => {
  const { state, logout } = useApp();
  
  if (!state.currentUser) return null;
  const { role, name } = state.currentUser;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <AcademicCapIcon className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SAMS</h1>
            <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4">
          {NAV_ITEMS.filter(item => item.roles.includes(role)).map(item => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === item.view 
                  ? 'bg-indigo-800 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-xs uppercase">
              {name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{name}</p>
              <p className="text-[10px] text-indigo-300 uppercase tracking-tighter">{role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-200 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</h2>
            <p className="text-slate-500 text-sm">Welcome back, {name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-wide">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
