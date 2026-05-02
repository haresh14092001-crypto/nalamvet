import React, { useState } from 'react';
import { GraduationCap, FileCheck, Users, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function TeachingHospitalDashboard() {
  const [activeTab, setActiveTab] = useState('review');

  const pendingCases = [
    { id: 'CAS-1024', student: 'Arjun S. (Year 4)', patient: 'Max (Dog)', diagnosis: 'Canine Parvovirus', status: 'draft', submittedAt: '10 Mins ago' },
    { id: 'CAS-1025', student: 'Priya K. (Intern)', patient: 'Bella (Cat)', diagnosis: 'Feline LUTD', status: 'reviewing', submittedAt: '1 Hour ago' },
  ];

  return (
    <div className="p-8">
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-3">
          <GraduationCap className="w-8 h-8" />
          Teaching Hospital Workflow
        </h1>
        <p className="text-neutral-400 mt-2">Student case drafts, faculty reviews, and academic grading.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-neutral-400 font-semibold">Pending Review</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-neutral-400 font-semibold">Approved Today</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-white">28</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-neutral-400 font-semibold">Active Students</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">45</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-neutral-800">
          <button 
            onClick={() => setActiveTab('review')}
            className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'review' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'}`}
          >
            Faculty Review Queue
          </button>
          <button 
            onClick={() => setActiveTab('discussions')}
            className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'discussions' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'}`}
          >
            Case Discussions
          </button>
        </div>

        {activeTab === 'review' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search student or case ID..." 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500 outline-none text-white"
                />
              </div>
              <button className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
                <Filter className="w-4 h-4" /> Filter by Department
              </button>
            </div>

            <div className="space-y-4">
              {pendingCases.map(caseItem => (
                <div key={caseItem.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <FileCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold">{caseItem.id}</span>
                        <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">{caseItem.patient}</span>
                      </div>
                      <p className="text-sm text-neutral-400">
                        <span className="text-blue-400">{caseItem.student}</span> submitted a draft for <strong className="text-neutral-200">{caseItem.diagnosis}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-neutral-500 uppercase font-semibold">{caseItem.status}</p>
                      <p className="text-xs text-neutral-400">{caseItem.submittedAt}</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                      Review Draft
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-bold text-sm">RBAC Enforced</h4>
                <p className="text-xs text-amber-500/80 mt-1">Students cannot print prescriptions or finalize clinical records until a faculty member signs off on the draft.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="p-12 text-center text-neutral-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Select a case to open the discussion thread.</p>
          </div>
        )}
      </div>
    </div>
  );
}
