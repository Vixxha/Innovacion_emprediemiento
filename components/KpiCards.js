'use client';

import React from 'react';
import { 
  TrendingUp, 
  Droplet, 
  DollarSign, 
  CheckCircle, 
  ShieldAlert, 
  ArrowUpRight, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { FINANCIAL_METRICS } from '../data/farmData';

export default function KpiCards({ onFilterCategory }) {
  const formatCLP = (val) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val).replace('CLP', '$');
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Métricas clave">
      {/* KPI 1: Ahorro por Hectárea */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ahorro por Hectárea
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              {formatCLP(FINANCIAL_METRICS.ahorroPorHa)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ ha</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg w-fit">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acumulado septiembre–febrero</span>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Suma: Agua + Agroquímicos + Horas</span>
          <span className="font-semibold text-emerald-700">Estimado · Demo</span>
        </p>
      </div>

      {/* KPI 2: Ahorro Total Predio (24 ha) -> Mejores Ganancias */}
      <div className="bg-gradient-to-br from-emerald-800 to-green-900 rounded-2xl p-5 text-white shadow-sm shadow-emerald-900/20 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Ahorro Total Predio (24 ha)
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {formatCLP(FINANCIAL_METRICS.ahorroTotalPredio)}
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-100/90 font-medium">
            Fondos retenidos directamente como <strong className="text-white underline decoration-emerald-400">utilidad neta</strong> de la temporada.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200">
          <span>ROI Tecnología CER:</span>
          <span className="font-bold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-md">
            {FINANCIAL_METRICS.roiTecnologia} Retorno
          </span>
        </div>
      </div>

      {/* KPI 3: Control y Manejo de Riego e Insumos */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Control Hídrico e Insumos
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              26%
            </span>
            <span className="text-xs text-slate-500 font-medium">ahorro agua y luz</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
              <span>Eficiencia agroquímicos</span>
              <span className="font-bold text-emerald-700">21% menos dosis</span>
            </div>
            <div role="progressbar" aria-label="Reducción de dosis de agroquímicos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={21} className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }}></div>
            </div>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Bombas de riego optimizadas</span>
          <span className="font-semibold text-emerald-700">350 m³ ahorrados</span>
        </p>
      </div>

      {/* KPI 4: Manejo y Control Operativo */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Manejo Digital de Labores
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              84%
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Sincronizado
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
              <span>Cuaderno de campo digital</span>
              <span className="font-bold text-slate-700">16% en papel</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tiempo de integración nueva fuente:</span>
          <span className="font-bold text-slate-800">2 días promedio</span>
        </p>
      </div>
    </section>
  );
}

