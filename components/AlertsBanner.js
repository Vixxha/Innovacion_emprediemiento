'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { ALERTAS } from '../data/farmData';

export default function AlertsBanner({ onSelectCuartel }) {
  const router = useRouter();
  const getBadgeStyle = (tipo) => {
    switch (tipo) {
      case 'danger':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'warn':
        return 'bg-sky-50 text-sky-900 border-sky-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCardBorder = (tipo) => {
    switch (tipo) {
      case 'danger':
        return 'border-l-4 border-l-amber-500 bg-white border border-slate-200/80';
      case 'warn':
        return 'border-l-4 border-l-sky-500 bg-white border border-slate-200/80';
      case 'success':
        return 'border-l-4 border-l-emerald-600 bg-white border border-slate-200/80';
      default:
        return 'border-l-4 border-l-slate-400 bg-white border border-slate-200/80';
    }
  };

  return (
    <section id="alertas" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Control de Alertas & Ahorro Preventivo
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            3 Activas
          </span>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Acciones inmediatas para evitar pérdidas y maximizar ganancias
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {ALERTAS.map((alerta) => (
          <div
            key={alerta.id}
            className={`rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${getCardBorder(alerta.tipo)}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${getBadgeStyle(alerta.tipo)}`}>
                  Prioridad {alerta.nivel}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Hoy
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5">
                {alerta.titulo}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {alerta.texto}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {alerta.ahorroImpacto}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  {alerta.ahorroTotal}
                </span>
                <button
                  onClick={() => {
                    const cuartelId = { 'alt-1': 4, 'alt-2': 2, 'alt-3': 1 }[alerta.id];
                    if (onSelectCuartel) onSelectCuartel(cuartelId);
                    router.push(`/cuarteles?cuartel=${cuartelId}`);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
                >
                  <span>Ver cuartel</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

