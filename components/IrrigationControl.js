'use client';

import React, { useState } from 'react';
import { 
  Droplets, 
  Zap, 
  Power, 
  CheckCircle2, 
  Sliders, 
  Clock, 
  Layers, 
  TrendingDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function IrrigationControl() {
  const [valvulas, setValvulas] = useState([
    { id: 1, sector: 'Sector 1 (Santina Norte)', cuartel: 'Cuartel 1', estado: 'Inactivo', caudal: '0 L/s', presion: '2.1 bar', sonda10: 31, sonda30: 33, sonda60: 35, turno: 'Mañana 06:00' },
    { id: 2, sector: 'Sector 2 (Santina Sur)', cuartel: 'Cuartel 2', estado: 'Riego Activo', caudal: '18.4 L/s', presion: '2.4 bar', sonda10: 19, sonda30: 22, sonda60: 28, turno: 'En curso (45 min rest)' },
    { id: 3, sector: 'Sector 3 (Lapins Este)', cuartel: 'Cuartel 3', estado: 'Inactivo', caudal: '0 L/s', presion: '2.2 bar', sonda10: 28, sonda30: 30, sonda60: 32, turno: 'Miércoles 05:30' },
    { id: 4, sector: 'Sector 4 (Lapins Oeste)', cuartel: 'Cuartel 4', estado: 'Programado Antihelada', caudal: 'Standby', presion: '2.5 bar', sonda10: 30, sonda30: 32, sonda60: 34, turno: 'Madrugada 01:30' },
    { id: 5, sector: 'Sector 5 (Regina Centro)', cuartel: 'Cuartel 5', estado: 'Inactivo', caudal: '0 L/s', presion: '2.3 bar', sonda10: 27, sonda30: 29, sonda60: 31, turno: 'Jueves 07:00' },
    { id: 6, sector: 'Sector 6 (Regina Alto)', cuartel: 'Cuartel 6', estado: 'Inactivo', caudal: '0 L/s', presion: '2.0 bar', sonda10: 26, sonda30: 28, sonda60: 30, turno: 'Viernes 06:00' }
  ]);

  const toggleValvula = (id) => {
    setValvulas(prev => prev.map(v => {
      if (v.id === id) {
        const nuevoEstado = v.estado === 'Riego Activo' ? 'Inactivo' : 'Riego Activo';
        return {
          ...v,
          estado: nuevoEstado,
          caudal: nuevoEstado === 'Riego Activo' ? '18.2 L/s' : '0 L/s'
        };
      }
      return v;
    }));
  };

  return (
    <section id="riego" className="bg-white rounded-2xl border border-emerald-100/90 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Droplets className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Manejo Hídrico Inteligente & Red de Riego
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control de electroválvulas y monitoreo multiprofundidad (10, 30 y 60 cm) para evitar el sobre-riego y reducir costos eléctricos.
          </p>
        </div>

        {/* Savings counter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-slate-600 font-medium">Agua Ahorrada:</span>
            <strong className="text-sky-900 font-extrabold">350 m³</strong>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-600 font-medium">Energía Bombeo:</span>
            <strong className="text-emerald-800 font-extrabold">-28% ($ 185.000/mes)</strong>
          </div>
        </div>
      </div>

      {/* Grid of Irrigation Valves */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {valvulas.map((v) => {
          const isActive = v.estado === 'Riego Activo';
          const isAntihelada = v.estado.includes('Antihelada');
          return (
            <div 
              key={v.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isActive 
                  ? 'border-sky-400 bg-sky-50/40 shadow-xs ring-2 ring-sky-400/20' 
                  : isAntihelada
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200/90 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-slate-900 text-sm">{v.sector}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-sky-500 text-white animate-pulse' 
                      : isAntihelada
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {v.estado}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Presión: <strong>{v.presion}</strong></span>
                  <span>·</span>
                  <span>Caudal: <strong>{v.caudal}</strong></span>
                </p>
              </div>

              {/* Sondas Multiprofundidad */}
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/70 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Perfil de Humedad de Raíces
                </span>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-[10px] text-slate-500 block">10 cm</span>
                    <strong className={`text-xs ${v.sonda10 < 22 ? 'text-amber-700' : 'text-slate-800'}`}>{v.sonda10}%</strong>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-[10px] text-slate-500 block">30 cm (Zona)</span>
                    <strong className={`text-xs ${v.sonda30 < 25 ? 'text-amber-700' : 'text-emerald-700'}`}>{v.sonda30}%</strong>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-[10px] text-slate-500 block">60 cm</span>
                    <strong className="text-xs text-slate-800">{v.sonda60}%</strong>
                  </div>
                </div>
              </div>

              {/* Turno and Switch Button */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {v.turno}
                </span>

                <button
                  onClick={() => toggleValvula(v.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                    isActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isActive ? 'Detener' : 'Activar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

