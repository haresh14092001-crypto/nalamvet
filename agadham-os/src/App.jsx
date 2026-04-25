import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Activity, Tractor, GraduationCap, ArrowRight } from 'lucide-react';
import './App.css';

// Feature Domains
import PetsExoticsDashboard from './pages/PetsExotics/Dashboard';
import FarmProductionDashboard from './pages/FarmProduction/Dashboard';
import TeachingHospitalDashboard from './pages/TeachingHospital/Dashboard';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tighter logo-gradient">அgadham</h1>
        <p className="text-neutral-400 text-lg uppercase tracking-widest font-bold">Vet OS Framework</p>
        <p className="text-neutral-500 mt-2 max-w-md mx-auto">Select your operational domain to load the dynamic role-based environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Module 1: Pets & Exotics */}
        <div onClick={() => navigate('/pets-exotics')} className="group cursor-pointer bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-emerald-500/50 hover:bg-neutral-800/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <Activity className="w-10 h-10 text-emerald-400 mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-white">Pets & Exotics</h2>
          <p className="text-neutral-400 text-sm mb-8">Clinical workflow, dynamic species engine, and CRM tools for companion animals and exotic pets.</p>
          <div className="flex items-center text-emerald-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
            Launch Module <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        {/* Module 2: Farm & Production */}
        <div onClick={() => navigate('/farm')} className="group cursor-pointer bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/50 hover:bg-neutral-800/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
          <Tractor className="w-10 h-10 text-amber-400 mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-white">Farm Config</h2>
          <p className="text-neutral-400 text-sm mb-8">Herd health metrics, FSSAI withdrawal periods, and yield tracking for livestock.</p>
          <div className="flex items-center text-amber-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
            Launch Module <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        {/* Module 3: Teaching Hospital */}
        <div onClick={() => navigate('/teaching')} className="group cursor-pointer bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-neutral-800/80 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <GraduationCap className="w-10 h-10 text-blue-400 mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-white">Teaching Setup</h2>
          <p className="text-neutral-400 text-sm mb-8">Student/Supervisor workflows, detailed academic clinical logging, and multi-department flow.</p>
          <div className="flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
            Launch Module <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pets-exotics/*" element={<PetsExoticsDashboard />} />
        <Route path="/farm/*" element={<FarmProductionDashboard />} />
        <Route path="/teaching/*" element={<TeachingHospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
