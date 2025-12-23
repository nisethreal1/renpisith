
import React, { useState } from 'react';
import { useApp } from '../store';
import { Student } from '../types';
import { UserPlusIcon, PencilSquareIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const StudentManagement: React.FC = () => {
  const { state, addStudent, updateStudent } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState('');

  const filteredStudents = state.students.filter(s => 
    !s.isArchived && s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      dob: formData.get('dob') as string,
      origin: formData.get('origin') as string,
      phone: formData.get('phone') as string,
      classId: formData.get('classId') as string,
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      isArchived: false,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, data);
    } else {
      addStudent(data);
    }
    setShowModal(false);
    setEditingStudent(null);
  };

  const inputStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-4 py-2.5 rounded-2xl text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder-slate-400 font-medium";
  const labelStyles = "block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02]"
        >
          <UserPlusIcon className="w-5 h-5" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-500 text-[0.65rem] font-black uppercase tracking-[0.15em]">
              <th className="px-8 py-5">ID</th>
              <th className="px-8 py-5">Full Name</th>
              <th className="px-8 py-5">Class</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-5 text-sm font-mono text-indigo-500 font-semibold">{student.id}</td>
                <td className="px-8 py-5">
                  <div className="text-sm font-bold text-slate-800">{student.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">DOB: {student.dob}</div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-xs font-bold text-slate-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    {state.classes.find(c => c.id === student.classId)?.name}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-600 font-medium">{student.phone}</td>
                <td className="px-8 py-5 text-right space-x-1">
                  <button 
                    onClick={() => { setEditingStudent(student); setShowModal(true); }}
                    className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => updateStudent(student.id, { isArchived: true })}
                    className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <ArchiveBoxIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-slate-400 italic">No students found matching your search</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                 <UserPlusIcon className="w-6 h-6" />
              </div>
              {editingStudent ? 'Edit Student' : 'New Student'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className={labelStyles}>Full Name</label>
                  <input name="name" defaultValue={editingStudent?.name} required className={inputStyles} placeholder="First and Last Name" />
                </div>
                <div>
                  <label className={labelStyles}>Date of Birth</label>
                  <input name="dob" type="date" defaultValue={editingStudent?.dob} required className={inputStyles} />
                </div>
                <div>
                  <label className={labelStyles}>Place of Origin</label>
                  <input name="origin" defaultValue={editingStudent?.origin} required className={inputStyles} placeholder="City, Country" />
                </div>
                <div>
                  <label className={labelStyles}>Phone Number</label>
                  <input name="phone" defaultValue={editingStudent?.phone} required className={inputStyles} placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className={labelStyles}>Class</label>
                  <select name="classId" defaultValue={editingStudent?.classId} required className={inputStyles}>
                    {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelStyles}>Address (Optional)</label>
                  <textarea name="address" defaultValue={editingStudent?.address} className={`${inputStyles} h-24 resize-none`} placeholder="Permanent residence address..." />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingStudent(null); }} className="flex-1 px-6 py-4 border border-slate-200 rounded-[1.25rem] font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
