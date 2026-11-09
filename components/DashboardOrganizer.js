'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Check, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

const STORAGE_KEY = 'cer-dashboard-layout-v1';

export default function DashboardOrganizer({ blocks }) {
  const initialOrder = blocks.map(block => block.id);
  const [order, setOrder] = useState(initialOrder);
  const [savedOrder, setSavedOrder] = useState(initialOrder);
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(stored) && stored.length === initialOrder.length && new Set(stored).size === stored.length && stored.every(id => initialOrder.includes(id))) {
        setOrder(stored);
        setSavedOrder(stored);
      }
    } catch { /* El orden predeterminado permite usar la página sin almacenamiento. */ }
    setReady(true);
  }, []);

  function move(id, direction) {
    const position = order.indexOf(id);
    const target = position + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[position], next[target]] = [next[target], next[position]];
    setOrder(next);
    setMessage(`${blocks.find(block => block.id === id).label}: posición ${target + 1} de ${order.length}.`);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
      setMessage('Distribución guardada en este navegador.');
    } catch {
      setMessage('Distribución aplicada. El navegador no permitió guardarla para la próxima visita.');
    }
    setSavedOrder([...order]);
    setEditing(false);
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 print:hidden">
      <div><h2 className="text-sm font-bold text-slate-900">Tu espacio de trabajo</h2><p className="mt-1 text-xs text-slate-500">{editing ? 'Usa las flechas de cada bloque para cambiar su posición y guarda el resultado.' : 'Elige en qué orden ver los indicadores, el gráfico y las herramientas.'}</p></div>
      <div className="flex flex-wrap gap-2">
        {editing ? <>
          <button type="button" onClick={() => { setOrder(initialOrder); setMessage('Orden original restaurado. Guarda para conservarlo.'); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><RotateCcw className="h-4 w-4" />Restablecer orden</button>
          <button type="button" onClick={() => { setOrder(savedOrder); setEditing(false); setMessage('Cambios descartados.'); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><X className="h-4 w-4" />Cancelar</button>
          <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800"><Check className="h-4 w-4" />Guardar distribución</button>
        </> : <button type="button" disabled={!ready} onClick={() => { setEditing(true); setMessage('Modo de organización activado.'); }} aria-expanded={editing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"><SlidersHorizontal className="h-4 w-4" />Organizar dashboard</button>}
      </div>
    </div>
    <p role="status" aria-live="polite" className={message ? 'rounded-lg bg-sky-50 px-4 py-3 text-xs text-sky-900 print:hidden' : 'sr-only'}>{message}</p>
    {order.map((id, index) => {
      const block = blocks.find(item => item.id === id);
      return <div key={id} data-dashboard-block={id} className={editing ? 'min-w-0 rounded-2xl border-2 border-dashed border-sky-300 p-2 sm:p-3' : 'min-w-0'}>
        {editing && <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-sky-50 px-3 py-2 print:hidden">
          <p className="text-xs font-bold text-sky-900">{index + 1}. {block.label}</p>
          <div className="flex gap-2"><button type="button" aria-label={`Subir ${block.label}`} disabled={index === 0} onClick={() => move(id, -1)} className="rounded-lg border border-sky-200 bg-white p-2 text-sky-800 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label={`Bajar ${block.label}`} disabled={index === order.length - 1} onClick={() => move(id, 1)} className="rounded-lg border border-sky-200 bg-white p-2 text-sky-800 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button></div>
        </div>}
        {block.content}
      </div>;
    })}
  </div>;
}
