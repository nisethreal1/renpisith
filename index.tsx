
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from './store';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { DashboardTeacher } from './components/DashboardTeacher';
import { StudentManagement } from './components/StudentManagement';
import { ClassManagement } from './components/ClassManagement';
import { AttendancePage } from './components/AttendancePage';
import { ReportsPage } from './components/ReportsPage';
import { PermissionManagement } from './components/PermissionManagement';
import { StudentDashboard, StudentPermissionPage } from './components/StudentView';
import { AcademicCapIcon, UserGroupIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const AuthPage: React.FC = () => {
  const { loginTeacher, registerTeacher, loginStudent } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'STUDENT'>('LOGIN');
  const [error, setError] = useState('');

  const handleTeacherSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (mode === 'LOGIN') {
      if (!loginTeacher(email, password)) {
        setError('Invalid email or password.');
      }
    } else {
      const name = formData.get('name') as string;
      if (!registerTeacher(name, email, password)) {
        setError('Email already exists.');
      }
    }
  };

  const handleStudentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const studentId = new FormData(e.currentTarget).get('studentId') as string;
    if (!loginStudent(studentId)) {
      setError('Student ID not found.');
    }
  };

  const inputClasses = "w-full bg-white/10 border border-white/20 px-5 py-4 rounded-[1.25rem] text-white outline-none focus:ring-4 focus:ring-indigo-400/20 focus:border-indigo-300 focus:bg-white/20 transition-all placeholder-white/30 font-medium";

  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div className="text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <AcademicCapIcon className="w-12 h-12 text-indigo-300" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">SAMS</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">School Attendance Management System</h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
            The all-in-one portal for teachers to manage academic groups and for students to track their journey.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => { setMode('LOGIN'); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-[1rem] transition-all ${mode === 'LOGIN' || mode === 'REGISTER' ? 'bg-white text-indigo-900 shadow-lg' : 'text-white hover:bg-white/5'}`}
            >
              Teacher
            </button>
            <button 
              onClick={() => { setMode('STUDENT'); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-[1rem] transition-all ${mode === 'STUDENT' ? 'bg-white text-indigo-900 shadow-lg' : 'text-white hover:bg-white/5'}`}
            >
              Student
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              {mode === 'LOGIN' ? 'Welcome Back' : mode === 'REGISTER' ? 'Create Account' : 'Student Portal'}
            </h3>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            {mode === 'STUDENT' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-indigo-200 uppercase tracking-[0.2em] ml-2">Student ID</label>
                  <input 
                    name="studentId" 
                    required 
                    placeholder="e.g. STD-1001" 
                    className={inputClasses}
                  />
                </div>
                <button type="submit" className="w-full bg-white text-indigo-900 py-4 rounded-[1.25rem] font-black flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl group">
                  Enter Portal <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-indigo-300 font-medium mt-4">
                  Log in with the unique ID provided by your school office.
                </p>
              </form>
            ) : (
              <form onSubmit={handleTeacherSubmit} className="space-y-5">
                {mode === 'REGISTER' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[0.65rem] font-black text-indigo-200 uppercase tracking-[0.2em] ml-2">Full Name</label>
                    <input 
                      name="name" 
                      required 
                      className={inputClasses}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-indigo-200 uppercase tracking-[0.2em] ml-2">Email Address</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-indigo-200 uppercase tracking-[0.2em] ml-2">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    className={inputClasses}
                  />
                </div>
                <button type="submit" className="w-full bg-white text-indigo-900 py-4 rounded-[1.25rem] font-black flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl group">
                  {mode === 'LOGIN' ? 'Login' : 'Sign Up'} <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                    className="text-xs font-bold text-white/80 hover:text-white underline decoration-indigo-400 underline-offset-4 transition-colors"
                  >
                    {mode === 'LOGIN' ? "Don't have an account? Register here" : "Already have an account? Login here"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [activeView, setActiveView] = useState('dashboard');

  if (!state.currentUser) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return state.currentUser.role === UserRole.TEACHER ? <DashboardTeacher /> : <StudentDashboard />;
      case 'students':
        return <StudentManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'attendance':
        return <AttendancePage />;
      case 'reports':
        return <ReportsPage />;
      case 'permissions':
        return state.currentUser.role === UserRole.TEACHER ? <PermissionManagement /> : <StudentPermissionPage />;
      case 'student-attendance':
        return <StudentDashboard />;
      default:
        return <DashboardTeacher />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
