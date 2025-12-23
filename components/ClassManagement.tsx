
import React, { useState } from 'react';
import { useApp } from '../store';
import { Class } from '../types';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  ArchiveBoxIcon, 
  AcademicCapIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export const ClassManagement: React.FC = () => {
  const { state, addClass, updateClass } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      isActive: formData.get('isActive') === 'on',
    };

    if (editingClass) {
      updateClass(editingClass.id, data);
    } else {
      addClass(data);
    }
    setShowModal(false);
    setEditingClass(null);
  };

  const inputStyles = "w-full bg-indigo-50/50 border border-indigo-100 px-5 py-3.5 rounded-2xl text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder-slate-400 font-bold";
  const labelStyles = "block text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Academic Groups</h3>
          <p className="text-sm text-slate-500 font-medium">Organize school sections and control class availability</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-[1.25rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02]"
        >
          <PlusIcon className="w-5 h-5" />
          New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.classes.map(cls => (
          <div key={cls.id} className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${!cls.isActive ? 'opacity-70 grayscale-[0.3]' : ''}`}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${cls.isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-500'}`}>
                  <AcademicCapIcon className="w-8 h-8" />
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => { setEditingClass(cls); setShowModal(true); }}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => updateClass(cls.id, { isActive: !cls.isActive })}
                    className={`p-3 rounded-2xl transition-all ${cls.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-green-600 bg-green-50 shadow-inner'}`}
                  >
                    <ArchiveBoxIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h4 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{cls.name}</h4>
              <p className="text-sm text-slate-500 mb-8 min-h-[48px] font-medium leading-relaxed">{cls.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <InformationCircleIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">
                    {state.students.filter(s => s.classId === cls.id && !s.isArchived).length} Students
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                  cls.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {cls.isActive ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                  {cls.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
               <div className="p-2 bg-indigo-600 rounded-xl text-white">
                 <AcademicCapIcon className="w-6 h-6" />
               </div>
               {editingClass ? 'Edit Class' : 'Create Class'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className={labelStyles}>Class Name</label>
                <input 
                  name="name" 
                  defaultValue={editingClass?.name} 
                  required 
                  className={inputStyles} 
                  placeholder="e.g. Mathematics 101"
                />
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Description</label>
                <textarea 
                  name="description" 
                  defaultValue={editingClass?.description} 
                  className={`${inputStyles} h-32 resize-none font-medium`} 
                  placeholder="Summarize course goals, location, and key schedule info..."
                />
              </div>
              <div className="flex items-center gap-3 py-2 px-1">
                <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      id="isActive"
                      defaultChecked={editingClass ? editingClass.isActive : true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <label htmlFor="isActive" className="ml-3 text-sm font-bold text-slate-600 uppercase tracking-wider">Active Status</label>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingClass(null); }} className="flex-1 py-4 border border-slate-200 rounded-[1.25rem] font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
