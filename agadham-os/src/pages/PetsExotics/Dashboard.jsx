import React, { useState } from 'react';
import { SPECIES_DB, validateVitals, calculateDosage } from '../../engine/SpeciesEngine';

export default function PetsExoticsDashboard() {
  const [activeSpecies, setActiveSpecies] = useState('dog');
  const [weight, setWeight] = useState(10);
  const [temp, setTemp] = useState(101.5);
  const [hr, setHr] = useState(100);

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
        <h1 className="text-3xl font-bold text-emerald-400">Pets & Exotics Clinical Hub</h1>
        <p className="text-neutral-400">Powered by the Agadham Species Engine</p>
      </header>
      
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
    </div>
  )
}
