'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  Droplet, 
  Thermometer, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { CUARTELES } from '../data/farmData';

export default function ParcelManagement({ selectedId, onSelectCuartel }) {
  const router = useRouter();
  const [activeCuartelId, setActiveCuartelId] = useState(CUARTELES.some(parcel => parcel.id === selectedId) ? selectedId : 4);
  const [actionFeedback, setActionFeedback] = useState(null);

  const selectedCuartel = CUARTELES.find(q => q.id === activeCuartelId) || CUARTELES[0];

  const handleAction = (accion) => {
    setActionFeedback(`Simulación: "${accion}" para ${selectedCuartel.nombre}. No se envió ninguna orden a dispositivos.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const formatCLP = (val) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val).replace('CLP', '$');
  };

  const getStatusBadge = (severidad, estado) => {
    switch (severidad) {
      case 'danger':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
            {estado}
          </span>
        );
      case 'warn':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            {estado}
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            {estado}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {estado}
          </span>
        );
    }
  };

  return (
    <section id="cuarteles" className="bg-white rounded-2xl border border-emerald-100/90 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Sprout className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Manejo y Control por Cuartel
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo en tiempo real de humedad de suelo, temperaturas mínimas y recomendaciones agronómicas de riego.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Superficie Total:</span>
          <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            24 ha · 6 Cuarteles
          </span>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-between animate-fade-in">
          <span>{actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-200 hover:text-white font-bold ml-2">×</button>
        </div>
      )}

      {/* Grid: Left Column Cards of Cuarteles, Right Column Live Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cuarteles Selection Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CUARTELES.map((q) => {
            const isSelected = q.id === activeCuartelId;
            return (
              <button
                key={q.id}
                aria-pressed={isSelected}
                onClick={() => {
                  setActiveCuartelId(q.id);
                  router.replace(`/cuarteles?cuartel=${q.id}`, { scroll: false });
                  if (onSelectCuartel) onSelectCuartel(q.id);
                }}
                className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between relative cursor-pointer ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20' 
                    : 'border-slate-200/90 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      Cuartel {q.numero}
                    </span>
                    {getStatusBadge(q.severidad, q.estadoRiego)}
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    {q.variedad} · <span className="font-normal text-slate-500">{q.ha} ha</span>
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <Droplet className="w-3.5 h-3.5 text-sky-600" />
                    <span>{q.humedadSuelo}% hum.</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    <span>{q.temperaturaMinima} °C</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700">
                    +${(q.ahorroEstimadoHa / 1000).toFixed(0)}k/ha
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Cuartel Control Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-[#f5faf3] border border-emerald-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-start justify-between border-b border-emerald-100/80 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                Panel de Control de Cuartel
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                {selectedCuartel.nombre}
              </h3>
              <p className="text-xs text-slate-500">
                Variedad {selectedCuartel.variedad} · {selectedCuartel.ha} ha · Portainjerto {selectedCuartel.portainjerto}
              </p>
            </div>
            {getStatusBadge(selectedCuartel.severidad, selectedCuartel.estadoGeneral)}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Droplet className="w-3 h-3 text-sky-600" />
                Humedad de Suelo
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedCuartel.humedadSuelo}%</p>
              <span className="text-[10px] text-slate-500">Rango ideal: {selectedCuartel.humedadMeta}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-600" />
                Mínima Nocturna
              </span>
              <p className={`text-lg font-extrabold mt-0.5 ${selectedCuartel.temperaturaMinima < 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                {selectedCuartel.temperaturaMinima} °C
              </p>
              <span className="text-[10px] text-slate-500">
                {selectedCuartel.temperaturaMinima < 0 ? 'Riesgo helada activo' : 'Normal'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                Última Labor
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{selectedCuartel.ultimaLabor}</p>
              <span className="text-[10px] text-slate-500">Sincronizado vía app</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-700" />
                Ahorro Proyectado
              </span>
              <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                {formatCLP(selectedCuartel.ahorroTotalCuartel)}
              </p>
              <span className="text-[10px] text-emerald-800 font-semibold">{formatCLP(selectedCuartel.ahorroEstimadoHa)}/ha</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recomendación del Asesor CER:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {selectedCuartel.recomendacion}
            </p>
          </div>

          {/* Direct Action Buttons */}
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Acciones de Control Inmediato
            </p>
            <div className="flex flex-col gap-2">
              {selectedCuartel.accionesControl.map((accion, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(accion)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-emerald-200 text-xs font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3 h-3 text-emerald-600 group-hover:text-white transition-colors" />
                    {accion}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

