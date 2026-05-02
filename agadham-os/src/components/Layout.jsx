import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Global Search (Cmd + K)..." 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-10 pr-4 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 focus:bg-neutral-900/80 transition-all placeholder:text-neutral-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                ⌘K
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </button>
            <div className="h-8 w-px bg-neutral-800"></div>
            <div className="text-sm font-semibold text-neutral-300">
              Chennai Metro Clinic
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-neutral-950/50">
          {children}
        </div>
      </main>
    </div>
  );
}
