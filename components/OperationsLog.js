'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';
import { LABORES } from '../data/farmData';

const STORAGE_KEY = 'cer-analytics-labores-demo-v1';
const LABOR_TYPES = ['Riego controlado por pulsos', 'Poda en verde y desbrote', 'Aplicación fitosanitaria guiada', 'Raleo manual de frutos', 'Mantenimiento de goteros y válvulas'];
function validLabor(item) {
  return item && LABOR_TYPES.includes(item.labor) && /^Cuartel [1-6]$/.test(item.cuartel)
    && Number.isInteger(item.horas) && item.horas >= 1 && item.horas <= 12
    && Number.isInteger(item.trabajadores) && item.trabajadores >= 1 && item.trabajadores <= 20
    && Number.isInteger(item.costoLabor) && item.costoLabor >= 0 && item.costoLabor <= 1000000000 && item.costoLabor % 1000 === 0;
}
function demoLabor(item) {
  return { id: item.id, fecha: item.fecha, labor: item.labor, cuartel: item.cuartel, horas: item.horas, trabajadores: item.trabajadores, costoLabor: item.costoLabor, ahorroGenerado: Math.round(item.costoLabor * 0.22), registro: 'Demo · Solo navegador', estado: 'local' };
}

export default function OperationsLog() {
  const [laboresList, setLaboresList] = useState(LABORES);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [formError, setFormError] = useState('');
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) throw new Error('Invalid saved records');
      const ids = new Set(LABORES.map((labor) => labor.id));
      const valid = saved.filter((item) => {
        if (!validLabor(item) || typeof item.id !== 'string' || !/^lab-[\w-]{1,100}$/.test(item.id) || typeof item.fecha !== 'string' || item.fecha.length > 100 || ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
      });
      setLaboresList([...valid.map(demoLabor), ...LABORES]);
      if (valid.length !== saved.length) setFeedback('Se omitieron registros locales dañados. Los datos de ejemplo siguen disponibles.');
    } catch {
      setFeedback('No se pudieron recuperar las labores locales. Los datos de ejemplo siguen disponibles.');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (showModal && !dialog.open) dialog.showModal();
    else if (!showModal && dialog.open) dialog.close();
  }, [showModal]);

  const closeModal = () => {
    dialogRef.current?.close();
    setShowModal(false);
    triggerRef.current?.focus();
  };

  const trapDialogFocus = (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')].filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
  
  // New labor form state
  const [nuevaLabor, setNuevaLabor] = useState({
    labor: 'Riego controlado por pulsos',
    cuartel: 'Cuartel 1',
    horas: 4,
    trabajadores: 2,
    costoLabor: 48000
  });

  const handleAgregarLabor = (e) => {
    e.preventDefault();
    const values = { ...nuevaLabor, horas: Number(nuevaLabor.horas), trabajadores: Number(nuevaLabor.trabajadores), costoLabor: Number(nuevaLabor.costoLabor) };
    if (!ready || [nuevaLabor.horas, nuevaLabor.trabajadores, nuevaLabor.costoLabor].some((value) => String(value).trim() === '') || !validLabor(values)) {
      setFormError('Complete valores válidos: 1–12 horas, 1–20 trabajadores y costo de 0 a 1.000.000.000 CLP en múltiplos de 1.000.');
      return;
    }
    const item = {
      id: `lab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      fecha: new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      labor: nuevaLabor.labor,
      cuartel: nuevaLabor.cuartel,
      horas: Number(nuevaLabor.horas),
      trabajadores: Number(nuevaLabor.trabajadores),
      costoLabor: Number(nuevaLabor.costoLabor),
      ahorroGenerado: Math.round(Number(nuevaLabor.costoLabor) * 0.22),
      registro: 'Demo · Solo navegador',
      estado: 'local'
    };
    setLaboresList([item, ...laboresList]);
    setSearchTerm('');
    setFormError('');
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...laboresList.filter((labor) => labor.estado === 'local')]));
      setFeedback('Labor de demostración guardada en este navegador. No se sincronizó con un servidor.');
    } catch {
      setFeedback('Labor agregada solo a esta vista: no se pudo guardar en el navegador y se perderá al salir o recargar. No se sincronizó con un servidor.');
    }
    closeModal();
  };

  const filteredLabores = laboresList.filter(l => 
    l.labor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.cuartel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCLP = (val) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val).replace('CLP', '$');
  };

  return (
    <section id="labores" className="min-w-0 bg-white rounded-2xl border border-emerald-100/90 p-4 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cuaderno de Campo Digital · Control de Labores
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro y control de horas hombre, tareas de poda, fertilización y riego ejecutadas por las cuadrillas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <label htmlFor="labor-search" className="sr-only">Buscar por labor o cuartel</label>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              id="labor-search"
              type="text"
              placeholder="Buscar labor o cuartel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            ref={triggerRef}
            disabled={!ready}
            onClick={() => { setFormError(''); setShowModal(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Labor</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">Prototipo de demostración. Las nuevas labores se guardan solo en este navegador; el ahorro mostrado se estima como el 22 % del costo y no es un resultado verificado.</p>
      <p role="status" aria-live="polite" className="text-xs font-medium text-slate-700">{feedback}</p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90">
        <table className="w-full min-w-[780px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
              <th className="py-3 px-4">Fecha y Hora</th>
              <th className="py-3 px-4">Labor Ejecutada</th>
              <th className="py-3 px-4">Cuartel</th>
              <th className="py-3 px-4 text-center">Horas</th>
              <th className="py-3 px-4 text-center">Operarios</th>
              <th className="py-3 px-4 text-right">Costo Labor</th>
              <th className="py-3 px-4 text-right">Ahorro Generado</th>
              <th className="py-3 px-4 text-center">Trazabilidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLabores.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-500">No hay labores que coincidan con la búsqueda.</td></tr>}
            {filteredLabores.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{l.fecha}</td>
                <td className="py-3 px-4 font-bold text-slate-800">{l.labor}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {l.cuartel}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-semibold text-slate-700">{l.horas} hrs</td>
                <td className="py-3 px-4 text-center text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {l.trabajadores}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-medium text-slate-700">{formatCLP(l.costoLabor)}</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">+{formatCLP(l.ahorroGenerado)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    l.estado === 'ok' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70' 
                      : 'bg-amber-50 text-amber-800 border border-amber-200/70'
                  }`}>
                    {l.estado === 'ok' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {l.registro}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to Register New Labor */}
        <dialog ref={dialogRef} aria-labelledby="labor-dialog-title" aria-describedby="labor-dialog-description" onKeyDown={trapDialogFocus} onCancel={(event) => { event.preventDefault(); closeModal(); }} onClose={() => setShowModal(false)} className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-emerald-100 backdrop:bg-slate-900/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 id="labor-dialog-title" className="font-extrabold text-slate-900 text-base">Registrar Labor en Terreno</h3>
              <button 
                type="button"
                aria-label="Cerrar registro de labor"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p id="labor-dialog-description" className="text-xs text-slate-500">Registro de demostración guardado en este navegador, sin sincronización real.</p>
            {formError && <p role="alert" className="text-xs font-semibold text-amber-900">{formError}</p>}

            <form onSubmit={handleAgregarLabor} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="labor-type" className="block font-semibold text-slate-700 mb-1">Tipo de Labor</label>
                <select 
                  id="labor-type" required autoFocus
                  value={nuevaLabor.labor}
                  onChange={(e) => setNuevaLabor({ ...nuevaLabor, labor: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="Riego controlado por pulsos">Riego controlado por pulsos</option>
                  <option value="Poda en verde y desbrote">Poda en verde y desbrote</option>
                  <option value="Aplicación fitosanitaria guiada">Aplicación fitosanitaria guiada</option>
                  <option value="Raleo manual de frutos">Raleo manual de frutos</option>
                  <option value="Mantenimiento de goteros y válvulas">Mantenimiento de goteros y válvulas</option>
                </select>
              </div>

              <div>
                <label htmlFor="labor-parcel" className="block font-semibold text-slate-700 mb-1">Cuartel Asignado</label>
                <select 
                  id="labor-parcel" required
                  value={nuevaLabor.cuartel}
                  onChange={(e) => setNuevaLabor({ ...nuevaLabor, cuartel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="Cuartel 1">Cuartel 1 - Santina (4.0 ha)</option>
                  <option value="Cuartel 2">Cuartel 2 - Santina (3.5 ha)</option>
                  <option value="Cuartel 3">Cuartel 3 - Lapins (4.5 ha)</option>
                  <option value="Cuartel 4">Cuartel 4 - Lapins (4.0 ha)</option>
                  <option value="Cuartel 5">Cuartel 5 - Regina (4.0 ha)</option>
                  <option value="Cuartel 6">Cuartel 6 - Regina (4.0 ha)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="labor-hours" className="block font-semibold text-slate-700 mb-1">Horas de Labor</label>
                  <input 
                    id="labor-hours" required step="1"
                    type="number" 
                    min="1" 
                    max="12" 
                    value={nuevaLabor.horas}
                    onChange={(e) => setNuevaLabor({ ...nuevaLabor, horas: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label htmlFor="labor-workers" className="block font-semibold text-slate-700 mb-1">N° Trabajadores</label>
                  <input 
                    id="labor-workers" required step="1"
                    type="number" 
                    min="1" 
                    max="20" 
                    value={nuevaLabor.trabajadores}
                    onChange={(e) => setNuevaLabor({ ...nuevaLabor, trabajadores: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="labor-cost" className="block font-semibold text-slate-700 mb-1">Costo Estimado de Jornada ($ CLP)</label>
                <input 
                  id="labor-cost" required min="0" max="1000000000"
                  type="number" 
                  step="1000"
                  value={nuevaLabor.costoLabor}
                  onChange={(e) => setNuevaLabor({ ...nuevaLabor, costoLabor: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Guardar en este navegador
                </button>
              </div>
            </form>
          </div>
        </dialog>
    </section>
  );
}

