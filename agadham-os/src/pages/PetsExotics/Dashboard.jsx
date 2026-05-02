import React, { useState } from 'react';
import { SPECIES_DB, validateVitals, calculateDosage } from '../../engine/SpeciesEngine';
import { Activity, Phone, ClipboardList, Bot, AlertTriangle } from 'lucide-react';

export default function PetsExoticsDashboard() {
  const [activeTab, setActiveTab] = useState('consult');
  const [activeSpecies, setActiveSpecies] = useState('dog');
  const [weight, setWeight] = useState(10);
  const [temp, setTemp] = useState(101.5);
  const [hr, setHr] = useState(100);
  const [chatInput, setChatInput] = useState('');

  // Mock drug database for demonstration
  const DRUG_DB = [
    { id: 'enro', name: 'Enrofloxacin', concMgPerMl: 50, doseDog: 5, doseCat: 5, doseAvian: 15, doseReptile: 5 },
    { id: 'melo', name: 'Meloxicam', concMgPerMl: 5, doseDog: 0.2, doseCat: 0.1, doseAvian: null, doseReptile: 0.1 },
  ];

  const speciesList = Object.values(SPECIES_DB).filter(s => 
    ['dog', 'cat', 'avian_small', 'reptile'].includes(s.id)
  );
  
  const currentSpecies = SPECIES_DB[activeSpecies.toUpperCase()];

  const tempStatus = validateVitals(activeSpecies, 'temp', temp);
  const hrStatus = validateVitals(activeSpecies, 'heartRate', hr);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
          <Activity className="w-8 h-8" />
          Pets & Exotics Clinical Hub
        </h1>
        <p className="text-neutral-400 mt-2">Powered by the Agadham Species Engine</p>
      </header>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('consult')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'consult' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <ClipboardList className="w-4 h-4" /> New Consultation
        </button>
        <button 
          onClick={() => setActiveTab('intake')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'intake' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <Phone className="w-4 h-4" /> AI Intake Layer
        </button>
      </div>

      {activeTab === 'intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">NalamVet AI Assistant</h3>
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span> Online
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              <div className="flex justify-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Today</span>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">🤖</div>
                <div className="bg-neutral-800 rounded-2xl rounded-tl-sm p-3 text-sm text-neutral-200 max-w-[80%] border border-neutral-700">
                  Hello! I'm the Agadham AI Intake Assistant. What seems to be the problem with your pet today?
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-sm">👤</div>
                <div className="bg-emerald-600 rounded-2xl rounded-tr-sm p-3 text-sm text-white max-w-[80%]">
                  My dog Tommy has been vomiting since morning and looks very weak.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">🤖</div>
                <div className="bg-neutral-800 rounded-2xl rounded-tl-sm p-3 text-sm text-neutral-200 max-w-[80%] border border-neutral-700">
                  I understand. Can you tell me Tommy's approximate age and breed? Has he eaten anything unusual recently?
                </div>
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type owner's response..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-4 pr-12 text-sm focus:border-emerald-500 outline-none text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-2">Structured Intake Data</h2>
              <div className="space-y-4">
                <div><label className="text-xs text-neutral-500 uppercase font-semibold block mb-1">Owner Name</label><input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white" placeholder="Extracted automatically..." value="Unidentified" readOnly/></div>
                <div><label className="text-xs text-neutral-500 uppercase font-semibold block mb-1">Pet Name & Species</label><input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white" placeholder="Extracted automatically..." value="Tommy (Dog)" readOnly/></div>
                <div><label className="text-xs text-neutral-500 uppercase font-semibold block mb-1">Primary Symptoms</label><textarea className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white resize-none" rows="2" value="Vomiting since morning, weakness" readOnly></textarea></div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-red-400 font-bold mb-2">Elevated Urgency Detected</h3>
              <p className="text-sm text-red-300/80 mb-4">Symptoms suggest potential dehydration or toxicity. Requires immediate attention.</p>
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg w-full transition-colors">
                Escalate to Duty Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'consult' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Settings */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">1. Patient Profile</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase">Select Species</label>
            <div className="flex gap-2 flex-wrap">
              {speciesList.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveSpecies(s.id)}
                  className={`px-4 py-2 rounded-lg font-bold border transition-colors ${activeSpecies === s.id ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-neutral-800 border-transparent text-neutral-400 hover:bg-neutral-700'}`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase">Weight (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={e => setWeight(e.target.value)}
              className="w-full bg-neutral-800 text-white rounded-lg p-3 outline-none focus:border-emerald-500 border border-transparent"
            />
          </div>
          
          {currentSpecies && (
            <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-900/50 rounded-lg">
              <h3 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wide">Species Flags</h3>
              <div className="flex flex-wrap gap-2">
                {currentSpecies.flags.map(f => (
                  <span key={f} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/20">{f.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Vitals check */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">2. Dynamic Vitals</h2>
          
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase">Temp ({currentSpecies?.vitals.temp.unit})</label>
            <input 
              type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)}
              className={`w-full bg-neutral-800 text-white rounded-lg p-3 outline-none border ${!tempStatus.isNormal ? 'border-red-500/50 bg-red-500/10 text-red-100' : 'border-transparent focus:border-emerald-500'}`}
            />
            {!tempStatus.isNormal && <span className="text-xs text-red-400 font-bold mt-1 block">⚠️ {tempStatus.message}</span>}
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase">Heart Rate ({currentSpecies?.vitals.heartRate.unit})</label>
            <input 
              type="number" value={hr} onChange={e => setHr(e.target.value)}
              className={`w-full bg-neutral-800 text-white rounded-lg p-3 outline-none border ${!hrStatus.isNormal ? 'border-red-500/50 bg-red-500/10 text-red-100' : 'border-transparent focus:border-emerald-500'}`}
            />
            {!hrStatus.isNormal && <span className="text-xs text-red-400 font-bold mt-1 block">⚠️ {hrStatus.message}</span>}
          </div>
        </div>

        {/* Auto Dose Calculator */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">3. Auto-Dosage Engine</h2>
          <div className="space-y-4">
            {DRUG_DB.map(drug => {
              const res = calculateDosage(drug, weight, activeSpecies);
              return (
                <div key={drug.id} className="p-4 bg-black/40 rounded-lg border border-neutral-800">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-lg">{drug.name} <span className="text-xs text-neutral-500 font-normal">({drug.concMgPerMl}mg/ml)</span></strong>
                  </div>
                  {res?.error ? (
                    <div className="text-sm text-amber-500 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      ⚠️ Contraindicated or lacks systemic dosage protocol for {currentSpecies?.name}.
                    </div>
                  ) : res ? (
                    <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-md border border-emerald-500/10">
                      <div>
                        <span className="text-xs text-neutral-400 uppercase tracking-wide block">Rate</span>
                        <span className="font-mono text-emerald-400">{res.mg_kg} mg/kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-400 uppercase tracking-wide block">Given Admin</span>
                        <span className="font-mono font-bold text-white bg-neutral-800 px-2 py-1 rounded">{res.total_ml} ml</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

      </div>
      )}
    </div>
  )
}
