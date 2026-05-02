import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Tractor, GraduationCap, Package, Search, Calendar, Settings, Home, Pill } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const currentModule = location.pathname.split('/')[1] || '';

  const navLinks = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Hub' },
    { to: '/pets-exotics', icon: <Activity className="w-5 h-5" />, label: 'Pets & Exotics' },
    { to: '/farm', icon: <Tractor className="w-5 h-5" />, label: 'Farm Production' },
    { to: '/teaching', icon: <GraduationCap className="w-5 h-5" />, label: 'Teaching Hospital' },
    { to: '/drugs', icon: <Pill className="w-5 h-5" />, label: 'Drug Ref' },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-black tracking-tighter logo-gradient">அgadham OS</h1>
        <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mt-1">Premium Vet Platform</div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-black font-bold text-xs">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Dr. Haresh</p>
            <p className="text-[10px] text-neutral-500 truncate">Senior Veterinarian</p>
          </div>
          <Settings className="w-4 h-4 text-neutral-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </aside>
  );
}
