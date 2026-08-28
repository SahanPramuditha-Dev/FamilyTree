import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FanChartRenderer } from '../../components/visualizations/FanChartRenderer';
import { TreeGrowthSimulator } from '../../components/visualizations/TreeGrowthSimulator';
import { 
  PieChart, 
  Clock, 
  Sparkles, 
  Layers, 
  Users, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const GenealogyVisualizerPage: React.FC = () => {
  const { members, family } = useFamily();
  const [activeTab, setActiveTab] = useState<'fanchart' | 'simulator'>('fanchart');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Deep Lineage Visualizations</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Genealogical Visualizer & Time-Lapse
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Explore 360-degree radial sunburst fan charts and watch your family tree grow through historical time-lapse simulation.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-soft self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('fanchart')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'fanchart'
                ? 'bg-forest-700 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>360° Fan Chart</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-forest-700 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time-Lapse Growth</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'fanchart' ? (
        <FanChartRenderer members={members} />
      ) : (
        <TreeGrowthSimulator members={members} />
      )}

    </div>
  );
};
