/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Sparkles, Calendar, RefreshCw, ChevronRight, X, ChevronDown, Info, Moon } from 'lucide-react';
import { getFestivalForDate, fetchFestivals, Festival } from './festivals';

interface ExplorerProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  onClose: () => void;
  onSelectFestival: (fest: Festival) => void;
  years: number[];
}

function Explorer({ selectedYear, setSelectedYear, onClose, onSelectFestival, years }: ExplorerProps) {
  const [yearFestivals, setYearFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  
  const { scrollYProgress } = useScroll({
    container: container ? { current: container } : undefined,
  });

  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const load = async () => {
      setIsLoadingFestivals(true);
      const data = await fetchFestivals(selectedYear);
      setYearFestivals(data);
      setIsLoadingFestivals(false);
    };
    load();
  }, [selectedYear]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col"
    >
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: bgY1 }}
        className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" 
      />
      <motion.div 
        style={{ y: bgY2 }}
        className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" 
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-lg font-bold focus:outline-none focus:border-purple-500 transition-colors"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-zinc-900">{y}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Festivals</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* List */}
      <div 
        ref={setContainer}
        className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4"
      >
        {isLoadingFestivals ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="animate-spin text-purple-500" size={32} />
          </div>
        ) : (
          yearFestivals.map((fest, idx) => {
            const festDate = parseISO(fest.date);
            const isPast = festDate < new Date();
            
            return (
              <motion.div
                key={fest.date + fest.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => onSelectFestival(fest)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                  isPast ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400/80 flex items-center gap-1">
                    {format(festDate, 'MMM d')}
                    {fest.hijriDate && <Moon size={8} />}
                  </span>
                  <h4 className="text-base font-medium tracking-tight">{fest.name}</h4>
                  {fest.hijriDate && (
                    <span className="text-[9px] text-gray-500">{fest.hijriDate}</span>
                  )}
                </div>
                <div className={`text-[10px] uppercase px-2 py-1 rounded-md font-bold ${
                  fest.type === 'holiday' ? 'bg-red-500/10 text-red-400' : 
                  fest.type === 'festival' ? 'bg-purple-500/10 text-purple-400' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {fest.type}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showExplorer, setShowExplorer] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showWidgetPreview, setShowWidgetPreview] = useState(false);

  // Calculate tomorrow's date
  const tomorrow = useMemo(() => addDays(currentTime, 1), [currentTime]);
  
  // Get festival for tomorrow
  const festivalTomorrow = useMemo(() => getFestivalForDate(tomorrow), [tomorrow]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => setCurrentTime(new Date());

  const years = [2025, 2026, 2027];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-t-2 border-white/20 border-r-2 rounded-full animate-spin" />
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
          >
            {/* Header Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-12 flex items-center gap-2"
            >
              <Calendar size={12} />
              What is tomorrow?
            </motion.div>

            {/* Main Date Display */}
            <div className="flex flex-col gap-2 mb-16">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-light tracking-tight text-gray-400"
              >
                {format(tomorrow, 'EEEE')}
              </motion.h2>
              
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight"
              >
                {format(tomorrow, 'd MMMM')}
                <span className="block text-3xl md:text-4xl font-light text-gray-500 mt-1">
                  {format(tomorrow, 'yyyy')}
                </span>
              </motion.h1>
            </div>

            {/* Festival / Event Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => festivalTomorrow && setSelectedFestival(festivalTomorrow)}
              className={`flex flex-col items-center gap-4 py-8 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm w-full transition-all ${festivalTomorrow ? 'cursor-pointer hover:bg-white/10 active:scale-[0.98]' : ''}`}
            >
              {festivalTomorrow ? (
                <>
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-purple-400 font-bold flex items-center justify-center gap-2">
                      {festivalTomorrow.type}
                      {festivalTomorrow.hijriDate && <Moon size={10} />}
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {festivalTomorrow.name}
                    </h3>
                    {festivalTomorrow.hijriDate && (
                      <span className="text-[10px] text-gray-500 font-medium">
                        {festivalTomorrow.hijriDate}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[10px] text-white/20 flex items-center gap-1">
                    <Info size={10} />
                    Tap for details
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 py-4">
                  <p className="text-gray-500 font-medium tracking-wide">
                    No major events tomorrow
                  </p>
                  <div className="h-[1px] w-8 bg-white/10 mx-auto" />
                </div>
              )}
            </motion.div>

            {/* Explorer Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExplorer(true)}
              className="mt-12 group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                Explore {selectedYear} Festivals
              </span>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </motion.button>

            {/* Widget Preview Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWidgetPreview(true)}
              className="mt-4 text-[10px] text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-widest font-bold"
            >
              Preview Home Widget
            </motion.button>

            {/* Footer / Refresh */}
            <div className="flex flex-col items-center mt-12">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRefresh}
                className="p-4 rounded-full text-gray-600 hover:text-white transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw size={20} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1 }}
                className="mt-4 text-[9px] uppercase tracking-widest font-bold"
              >
                Tomorrow App
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Explorer Overlay */}
      <AnimatePresence>
        {showExplorer && (
          <Explorer 
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onClose={() => setShowExplorer(false)}
            onSelectFestival={setSelectedFestival}
            years={years}
          />
        )}
      </AnimatePresence>

      {/* Festival Detail Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-[40px] p-8 max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-600" />
              
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 rounded-full bg-white/5">
                  <Sparkles size={32} className="text-purple-400" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-purple-500 font-bold">
                    {selectedFestival.type}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight leading-tight">
                    {selectedFestival.name}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {format(parseISO(selectedFestival.date), 'EEEE, d MMMM yyyy')}
                  </p>
                  {selectedFestival.hijriDate && (
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">
                      <Moon size={10} />
                      {selectedFestival.hijriDate}
                    </div>
                  )}
                </div>

                <div className="w-12 h-[1px] bg-white/10" />

                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedFestival.description || "No detailed description available for this event."}
                </p>

                <button
                  onClick={() => setSelectedFestival(null)}
                  className="mt-4 w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide active:scale-[0.98] transition-transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Preview Overlay */}
      <AnimatePresence>
        {showWidgetPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-xl font-bold mb-2">Home Widget Preview</h2>
              <p className="text-sm text-gray-500">How "Tomorrow" looks on your home screen</p>
            </div>

            {/* Simulated Android Widget */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-64 h-64 bg-zinc-900 rounded-[32px] p-6 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full" />
              
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Tomorrow</span>
                <h3 className="text-2xl font-bold tracking-tighter">{format(tomorrow, 'd MMM')}</h3>
                <span className="text-xs text-gray-400 font-medium">{format(tomorrow, 'EEEE')}</span>
              </div>

              <div className="flex flex-col gap-2">
                {festivalTomorrow ? (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <Sparkles size={14} className="text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold leading-tight">{festivalTomorrow.name}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-tighter">{festivalTomorrow.type}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-medium italic">No major events</span>
                )}
              </div>
            </motion.div>

            <button
              onClick={() => setShowWidgetPreview(false)}
              className="mt-16 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold active:scale-[0.95] transition-transform"
            >
              Back to App
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Status Bar Simulation */}
      <div className="fixed top-0 left-0 w-full h-12 flex items-center justify-between px-6 opacity-30 pointer-events-none z-40">
        <span className="text-xs font-medium">{format(currentTime, 'HH:mm')}</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-2 border border-white rounded-sm" />
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

