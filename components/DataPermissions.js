'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Unlock, Clock } from 'lucide-react';
import { PERMISOS_GOBERNANZA } from '../data/farmData';

const STORAGE_KEY = 'cer-analytics-permisos-demo-v1';

export default function DataPermissions() {
  const [permisos, setPermisos] = useState(PERMISOS_GOBERNANZA);
  const [ready, setReady] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        setPermisos(PERMISOS_GOBERNANZA.map((permiso) => {
          if (typeof saved[permiso.id] !== 'boolean') return permiso;
          const activo = saved[permiso.id];
          return { ...permiso, activo, estado: activo ? 'Activo (Demo)' : 'Revocado (Sin acceso)', status: activo ? 'ok' : 'neutro' };
        }));
      }
    } catch {
      // El prototipo sigue disponible si el navegador bloquea el almacenamiento.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(permisos.map((p) => [p.id, p.activo]))));
    } catch {
      setToastMessage('El navegador no permite guardar los permisos de demostración; los cambios durarán hasta salir de esta página.');
    }
  }, [permisos, ready]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const togglePermiso = (id) => {
    const permiso = permisos.find((p) => p.id === id);
    if (!permiso || !ready) return;
    setPermisos((previous) => previous.map((p) => p.id === id ? {
      ...p,
      activo: !p.activo,
      estado: !p.activo ? 'Activo (Demo)' : 'Revocado (Sin acceso)',
      status: !p.activo ? 'ok' : 'neutro'
    } : p));
    setToastMessage(`Permiso de demostración ${permiso.activo ? 'revocado' : 'activado'} para ${permiso.entidad}.`);
  };

  return (
    <>
      <div role="status" aria-live="polite" className={toastMessage ? 'fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg z-50' : 'sr-only'}>{toastMessage}</div>
      <section id="permisos" className="min-w-0 bg-white rounded-2xl border border-emerald-100/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Control de Permisos de Datos
              </h2>
              <p className="text-xs text-slate-500">
                Usted decide quién accede a la información del predio
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {permisos.map((p) => (
            <div 
              key={p.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-wrap items-start justify-between gap-3 ${
                p.activo ? 'border-emerald-200/90 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/60 opacity-75'
              }`}
            >
              <div className="min-w-0 flex-1 basis-52 space-y-1 break-words">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs">{p.entidad}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    p.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {p.estado}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{p.rol}</p>
                <p className="text-[10px] text-slate-400">Alcance: {p.alcance}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-semibold pt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{p.activo ? (p.vigencia === 'Revocado temporalmente' ? 'Vigencia de demostración durante esta temporada' : p.vigencia) : 'Sin permiso vigente'}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!ready}
                aria-pressed={p.activo}
                aria-label={`${p.activo ? 'Revocar' : 'Conceder'} permiso de demostración para ${p.entidad}`}
                onClick={() => togglePermiso(p.id)}
                className={`shrink-0 min-h-11 p-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  p.activo 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
                title={p.activo ? 'Revocar permiso' : 'Conceder permiso'}
              >
                {p.activo ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{p.activo ? 'Activo' : 'Revocado'}</span>
              </button>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 leading-relaxed">
          Demostración: los cambios se guardan solo en este navegador. No modifican accesos reales, no aplican vencimientos automáticos ni generan una auditoría en un servidor.
        </p>
      </section>
    </>
  );
}
