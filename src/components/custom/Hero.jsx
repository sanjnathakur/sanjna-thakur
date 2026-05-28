import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center gap-8 overflow-hidden">
      
      {/* Premium glowing background sphere */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-wider uppercase text-blue-600 bg-blue-50 rounded-full z-10 animate-fade-in">
        ✨ AI Travel Curator v2.0
      </div>

      {/* Main Headline */}
      <h1 className="font-black text-4xl sm:text-6xl tracking-tight text-slate-900 z-10 max-w-3xl leading-[1.15] mt-2">
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Discover Your Next Adventure
        </span>
        <br />
        <span className="text-slate-800">Personalized Itineraries at Your Fingertips</span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-500 text-base sm:text-lg font-medium max-w-2xl leading-relaxed z-10">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests, schedule, and budget using state-of-the-art artificial intelligence.
      </p>

      {/* Luxury Call to Action Button */}
      <Link to="/create-trip" className="z-10 mt-2">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-full py-4 px-8 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer">
          <span>Get Started, It's Free</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </Link>

      {/* Live Interactive Browser Mockup */}
      <div className="w-full mt-10 rounded-3xl border border-slate-200/80 bg-white/70 shadow-2xl shadow-blue-900/5 backdrop-blur-md overflow-hidden z-10 animate-slide-up select-none pointer-events-none">
        
        {/* Browser Top Chrome bar */}
        <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-3 flex items-center gap-2">
          {/* macOS window control buttons */}
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>
          {/* Simulated URL bar */}
          <div className="bg-white border border-slate-200/80 text-[10px] text-slate-400 font-semibold py-1 px-8 rounded-lg mx-auto w-[240px] sm:w-[320px] text-center truncate">
            https://weave-ai.com/itinerary/amalfi-coast
          </div>
        </div>

        {/* Browser Mockup Body */}
        <div className="p-4 sm:p-6 bg-slate-50/30 text-left flex flex-col gap-6">
          
          {/* Mockup Trip Banner */}
          <div className="relative h-[180px] sm:h-[260px] rounded-2xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80" 
              alt="Amalfi Coast Italy" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            {/* Title card overlay */}
            <div className="absolute bottom-5 left-5 text-white">
              <span className="inline-block bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mb-2">🇮🇹 Summer Getaway</span>
              <h2 className="font-black text-xl sm:text-2xl tracking-tight">Amalfi Coast Road Trip, Italy</h2>
            </div>
          </div>

          {/* Side-by-Side Weather & Map Mockup widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Weather Widget Mockup */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-md flex flex-col justify-between h-[160px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 text-[8px] font-black tracking-wider uppercase text-blue-600 bg-blue-50 rounded-full">Live Weather</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1.5">Amalfi Coast, Italy</h3>
                  <p className="text-slate-400 text-[10px] font-semibold">Sunny & Clear Sky</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl">☀️</span>
                  <span className="text-xl font-black text-slate-800">26°C</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-50 text-center">
                <div className="bg-slate-50 p-1 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Thu</span>
                  <span className="text-xs block my-0.5">☀️</span>
                  <span className="text-[8px] font-black text-slate-700">26°/19°</span>
                </div>
                <div className="bg-slate-50 p-1 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Fri</span>
                  <span className="text-xs block my-0.5">⛅</span>
                  <span className="text-[8px] font-black text-slate-700">25°/18°</span>
                </div>
                <div className="bg-slate-50 p-1 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Sat</span>
                  <span className="text-xs block my-0.5">🌧️</span>
                  <span className="text-[8px] font-black text-slate-700">22°/16°</span>
                </div>
              </div>
            </div>

            {/* Interactive Map Widget Mockup */}
            <div className="bg-white border border-slate-100 rounded-3xl p-2 shadow-md h-[160px] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&h=200&q=80" 
                alt="Static Map illustration" 
                className="w-full h-full object-cover rounded-2xl filter brightness-[0.95]"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[8px] font-black uppercase text-slate-800 tracking-wider">Explore Map</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Hero;
