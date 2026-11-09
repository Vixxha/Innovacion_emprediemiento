'use client';

import React from 'react';
import { 
  CloudSun, 
  ThermometerSnowflake, 
  Wind, 
  Droplets, 
  Sun, 
  AlertOctagon, 
  ShieldCheck, 
  Sparkles,
  ArrowDownRight
} from 'lucide-react';

export default function WeatherFrostWidget() {
  const horasPronostico = [
    { hora: '20:00', temp: 11.2, hr: 68, riesgo: 'Bajo', color: 'text-emerald-700 bg-emerald-50' },
    { hora: '22:00', temp: 7.8, hr: 74, riesgo: 'Bajo', color: 'text-emerald-700 bg-emerald-50' },
    { hora: '00:00', temp: 4.1, hr: 81, riesgo: 'Medio', color: 'text-sky-700 bg-sky-50' },
    { hora: '02:00', temp: 1.0, hr: 87, riesgo: 'Precaución', color: 'text-amber-700 bg-amber-50' },
    { hora: '04:00', temp: -1.4, hr: 92, riesgo: 'Helada Crítica', color: 'text-red-700 bg-red-50 border border-red-200' },
    { hora: '06:00', temp: -0.8, hr: 90, riesgo: 'Helada Activa', color: 'text-red-700 bg-red-50 border border-red-200' },
    { hora: '08:00', temp: 5.5, hr: 78, riesgo: 'Recuperación', color: 'text-emerald-700 bg-emerald-50' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/90 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ThermometerSnowflake className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Control Agroclimático & Detección Temprana de Heladas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pronóstico térmico hora a hora calibrado con la estación meteorológica del predio para proteger floración y fruto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            <AlertOctagon className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Alerta Activa: 02:00 - 06:30 h</span>
          </span>
        </div>
      </div>

      {/* Live Weather Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            T° Actual
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">12.8 °C</p>
          <span className="text-[11px] text-slate-500">Máx hoy: 21.4 °C</span>
        </div>

        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            Humedad Relativa
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">68 %</p>
          <span className="text-[11px] text-slate-500">Punto de rocío: 6.2 °C</span>
        </div>

        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            Viento en Superficie
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">4.2 km/h</p>
          <span className="text-[11px] text-slate-500">Calma (Riesgo inversión)</span>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-900 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Ahorro por Prevención
          </span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">$ 480.000</p>
          <span className="text-[11px] text-emerald-900 font-semibold">Pérdida floral evitada</span>
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Curva Térmica Proyectada (Esta Noche / Madrugada)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {horasPronostico.map((h, i) => (
            <div 
              key={i}
              className={`p-3 rounded-xl flex flex-col items-center justify-between text-center transition-all ${
                h.temp < 0 ? 'bg-amber-50/90 border-2 border-amber-400 shadow-xs' : 'bg-slate-50/80 border border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-slate-700">{h.hora}</span>
              <p className={`text-xl font-extrabold my-1.5 ${h.temp < 0 ? 'text-amber-800' : 'text-slate-900'}`}>
                {h.temp > 0 ? `+${h.temp}` : h.temp} °C
              </p>
              <div className="w-full space-y-1">
                <span className="text-[10px] text-slate-500 block">HR: {h.hr}%</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md block ${h.color}`}>
                  {h.riesgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <h4 className="font-extrabold text-sm">Protocolo Antiheladas Automatizado CER</h4>
          </div>
          <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            Encendido programado de aspersores a <strong>0.5 °C en descenso (aprox. 01:30 h)</strong> en Cuartel 4. El control focalizado ahorra un 75% de agua y energía eléctrica frente a encender todo el predio.
          </p>
        </div>
        <button 
          onClick={() => alert('Protocolo de riego antiheladas confirmado para Cuartel 4 (Lapins Oeste).')}
          className="shrink-0 px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-extrabold transition-colors shadow-xs"
        >
          Confirmar Protocolo
        </button>
      </div>
    </div>
  );
}

