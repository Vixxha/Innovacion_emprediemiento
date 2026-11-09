'use client';

import React from 'react';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Bell, 
  MapPin, 
  SlidersHorizontal 
} from 'lucide-react';
import { FARM_INFO } from '../data/farmData';

export default function Header({ onOpenSimulator, title, description }) {
  return (
    <header className="bg-white border-b border-emerald-100/80 px-6 py-5 sticky top-0 z-10 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Predio Demostración
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Valle Central · 24 ha de cerezos
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {FARM_INFO.temporada}
            </span>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title || 'Panel de Manejo, Control y Rentabilidad'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {description || 'Optimización de recursos hídricos, insumos y mano de obra.'}
          </p>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3.5 py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">Telemetría</p>
              <p className="text-xs font-semibold text-emerald-700">5 de 6 fuentes · Demo</p>
            </div>
          </div>

          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-emerald-600/30 hover:shadow-md hover:shadow-emerald-600/35"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulador de Ahorro y Ganancias</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm transition-colors shadow-xs"
            title="Imprimir o guardar como PDF"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Exportar Reporte</span>
          </button>
        </div>
      </div>
    </header>
  );
}

