import React, { useState } from 'react';
import { Tractor, TrendingUp, Calendar, AlertCircle, Droplet, Sprout } from 'lucide-react';

export default function FarmProductionDashboard() {
  const [activeTab, setActiveTab] = useState('yield');
  
  // Feed Optimizer State
  const [feedSpecies, setFeedSpecies] = useState('cattle');
  const [feedWeight, setFeedWeight] = useState(400);
  const [feedGoal, setFeedGoal] = useState('lactation');
  const [feedBudget, setFeedBudget] = useState('optimal');
  
  const calculateFeed = () => {
    // Mock algorithm for demonstration
    let dmReq = (feedWeight * 0.03).toFixed(1); // 3% of body weight
    if (feedGoal === 'lactation') dmReq = (feedWeight * 0.035).toFixed(1);
    
    return {
      dryMatter: dmReq,
      roughage: (dmReq * 0.6).toFixed(1),
      concentrate: (dmReq * 0.4).toFixed(1),
      calcium: (feedWeight * 0.04).toFixed(0),
      phosphorus: (feedWeight * 0.02).toFixed(0),
    };
  };
  
  const feedPlan = calculateFeed();

  return (
    <div className="p-8">
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
          <Tractor className="w-8 h-8" />
          Farm Production Hub
        </h1>
        <p className="text-neutral-400 mt-2">Herd tracking, Yield Analytics, and Feed Optimization Engine.</p>
      </header>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('yield')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'yield' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          Yield & Production
        </button>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'feed' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          Feed Optimizer
        </button>
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'breeding' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          Breeding & Heat Logs
        </button>
      </div>

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Sprout className="w-5 h-5 text-emerald-400" />
              Feed Strategy Input
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-neutral-400 mb-2 uppercase font-semibold">Species & Stage</label>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={feedSpecies} onChange={(e) => setFeedSpecies(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="cattle">Dairy Cattle</option>
                    <option value="buffalo">Buffalo</option>
                    <option value="goat">Goat</option>
                    <option value="sheep">Sheep</option>
                  </select>
                  <select 
                    value={feedGoal} onChange={(e) => setFeedGoal(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="lactation">High Lactation</option>
                    <option value="pregnancy">Late Pregnancy</option>
                    <option value="growth">Growth/Fattening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2 uppercase font-semibold">Body Weight (kg)</label>
                <input 
                  type="number" value={feedWeight} onChange={(e) => setFeedWeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2 uppercase font-semibold">Budget Mode</label>
                <div className="flex gap-3">
                  {['economy', 'optimal', 'premium'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setFeedBudget(mode)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize border ${feedBudget === mode ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-neutral-950 text-neutral-500 border-neutral-800'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg transition-colors">
                  Generate Formulation
                </button>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-xl font-bold text-white mb-6 relative z-10">Calculated Ration Plan</h2>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
                <div>
                  <p className="text-neutral-400 text-sm">Total Dry Matter (DM) Reqd.</p>
                  <p className="text-2xl font-bold text-white">{feedPlan.dryMatter} <span className="text-sm text-neutral-500">kg/day</span></p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  {((feedPlan.dryMatter/feedWeight)*100).toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400 text-sm mb-1">Roughage (Green + Dry)</p>
                  <p className="text-xl font-bold text-amber-400">{feedPlan.roughage} <span className="text-xs text-neutral-500">kg DM</span></p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400 text-sm mb-1">Concentrate Mixture</p>
                  <p className="text-xl font-bold text-blue-400">{feedPlan.concentrate} <span className="text-xs text-neutral-500">kg DM</span></p>
                </div>
              </div>

              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 mt-4">
                <p className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Additives & Supplements
                </p>
                <div className="flex justify-between text-sm text-emerald-100/70 border-b border-emerald-500/10 pb-2 mb-2">
                  <span>Mineral Mixture (Type II)</span>
                  <span className="font-mono">50 g/day</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-100/70">
                  <span>Calcium Supplementation</span>
                  <span className="font-mono">{feedPlan.calcium} g/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'yield' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-400 text-sm font-semibold uppercase">Daily Milk Yield</p>
                <h3 className="text-3xl font-bold text-white mt-1">425 <span className="text-lg text-neutral-500">Liters</span></h3>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                <Droplet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-4 h-4" /> +12.5% from last week
            </p>
          </div>
          <div className="col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center justify-center text-neutral-500">
            [ Yield Chart Visualization Placeholder ]
          </div>
        </div>
      )}

      {activeTab === 'breeding' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Breeding & Expectancy Log</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="py-3 text-sm font-semibold text-neutral-400 uppercase">Tag / Animal ID</th>
                <th className="py-3 text-sm font-semibold text-neutral-400 uppercase">Last Heat</th>
                <th className="py-3 text-sm font-semibold text-neutral-400 uppercase">Insemination Date</th>
                <th className="py-3 text-sm font-semibold text-neutral-400 uppercase">Expected Calving</th>
                <th className="py-3 text-sm font-semibold text-neutral-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                <td className="py-4 text-white font-bold">Cow #402</td>
                <td className="py-4 text-neutral-300">12 Oct 2025</td>
                <td className="py-4 text-neutral-300">14 Oct 2025</td>
                <td className="py-4 text-amber-400 font-mono">22 Jul 2026</td>
                <td className="py-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold">Pregnant</span></td>
              </tr>
              <tr className="hover:bg-neutral-800/20 transition-colors">
                <td className="py-4 text-white font-bold">Buffalo #18</td>
                <td className="py-4 text-neutral-300">01 Nov 2025</td>
                <td className="py-4 text-neutral-300">-</td>
                <td className="py-4 text-neutral-500">-</td>
                <td className="py-4"><span className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-3 py-1 rounded-full text-xs font-bold">Open</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
