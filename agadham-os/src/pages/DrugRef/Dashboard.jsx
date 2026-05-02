import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Info, Pill, Stethoscope, BriefcaseMedical } from 'lucide-react';
import drugData from '../../data/drugs.json';

export default function DrugRefDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [drugs, setDrugs] = useState([]);
  
  // Extract unique categories (since many old records lack category, we can normalize slightly or just use existing)
  const categories = [...new Set(drugData.map(d => d.category).filter(Boolean))];

  useEffect(() => {
    let filtered = drugData;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.generic?.toLowerCase().includes(lower) || 
        d.brands?.toLowerCase().includes(lower) ||
        d.indications?.toLowerCase().includes(lower)
      );
    }
    if (filterSpecies) {
      filtered = filtered.filter(d => d.species && d.species.includes(filterSpecies));
    }
    if (filterCategory) {
      filtered = filtered.filter(d => d.category === filterCategory);
    }
    setDrugs(filtered);
  }, [searchTerm, filterSpecies, filterCategory]);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
          <Pill className="w-8 h-8" />
          Veterinary Drug Formulary
        </h1>
        <p className="text-neutral-400 mt-2">Comprehensive database of {drugData.length} records including Intas & Virbac products.</p>
      </header>

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search generic, brand, or indications..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none text-white"
          />
        </div>
        
        <select 
          value={filterSpecies}
          onChange={(e) => setFilterSpecies(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none"
        >
          <option value="">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Cattle">Cattle</option>
          <option value="Horse">Horse</option>
          <option value="Avian">Avian</option>
        </select>

        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm text-neutral-300 focus:border-emerald-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Drug Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drugs.slice(0, 50).map(drug => (
          <div key={drug.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{drug.generic || 'Unknown Generic'}</h3>
                <p className="text-sm text-neutral-400 mt-1"><span className="text-emerald-500/80">Brands:</span> {drug.brands || 'None specified'}</p>
              </div>
              {drug.manufacturer && (
                <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md">
                  {drug.manufacturer}
                </span>
              )}
            </div>
            
            <div className="space-y-3 mt-4 text-sm">
              <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-800/50">
                <div className="flex items-center gap-2 text-neutral-300 mb-1 font-semibold">
                  <Stethoscope className="w-4 h-4 text-emerald-400" /> Indications
                </div>
                <p className="text-neutral-400 line-clamp-2" title={drug.indications}>{drug.indications || 'Not specified'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {drug.doseDog && (
                  <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-800/50">
                    <span className="text-[10px] uppercase text-neutral-500 block mb-1">Dog Dose</span>
                    <span className="text-emerald-400 font-mono text-xs">{drug.doseDog}</span>
                  </div>
                )}
                {drug.doseCat && (
                  <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-800/50">
                    <span className="text-[10px] uppercase text-neutral-500 block mb-1">Cat Dose</span>
                    <span className="text-emerald-400 font-mono text-xs">{drug.doseCat}</span>
                  </div>
                )}
                {drug.doseCattle && (
                  <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-800/50">
                    <span className="text-[10px] uppercase text-neutral-500 block mb-1">Cattle Dose</span>
                    <span className="text-amber-400 font-mono text-xs">{drug.doseCattle}</span>
                  </div>
                )}
              </div>

              {drug.contraindications && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 line-clamp-2" title={drug.contraindications}>{drug.contraindications}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {drugs.length > 50 && (
        <div className="mt-8 text-center text-sm text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-xl py-3">
          Showing 50 of {drugs.length} results. Use search to narrow down.
        </div>
      )}
      {drugs.length === 0 && (
        <div className="mt-8 text-center text-neutral-500 py-12">
          <BriefcaseMedical className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No drugs found matching criteria.</p>
        </div>
      )}
    </div>
  );
}
