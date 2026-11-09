'use client';

import Link from 'next/link';
import { TrendingUp, Sparkles } from 'lucide-react';
import { FARM_INFO, MONTHLY_SAVINGS } from '../data/farmData';
import SavingsChart, { SAVINGS_SERIES, monthlyTotal } from './SavingsChart';
import SavingsInsights from './charts/SavingsInsights';

const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

export default function SavingsAndProfits({ onOpenSimulator }) {
  const savings = MONTHLY_SAVINGS.reduce((sum, month) => sum + monthlyTotal(month), 0) * 1000;
  const baseline = 1450000;
  const improvement = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(savings / baseline * 100);
  const actionClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700';

  return (
    <section id="ahorros" aria-labelledby="savings-heading" className="space-y-6 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="min-w-0">
          <div className="flex items-start gap-2"><TrendingUp className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" /><h2 id="savings-heading" className="text-xl font-bold tracking-tight text-slate-900">Ahorro mensual por hectárea</h2></div>
          <p className="mt-2 text-sm text-slate-600">Datos de demostración. Ahorro estimado por categoría, de septiembre a febrero.</p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><span className="block text-xs">Acumulado de la temporada</span><strong className="text-xl">{money(savings)} / ha</strong></div>
      </div>
      <SavingsChart months={MONTHLY_SAVINGS} hectares={FARM_INFO.superficieTotal} />
      <SavingsInsights months={MONTHLY_SAVINGS} />
      <div className="space-y-3 border-t border-slate-100 pt-5">
        <h3 className="font-bold text-slate-900">Ejemplo de impacto en el margen neto</h3>
        <p className="text-sm leading-relaxed text-slate-600">Supuesto de demostración: margen base de {money(baseline)} / ha. Se suma únicamente el ahorro estimado de {money(savings)} / ha; ingresos y demás costos permanecen constantes. No es una predicción de rentabilidad.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-600">Margen base supuesto</p><strong className="text-2xl text-slate-900">{money(baseline)} / ha</strong></div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm text-emerald-900">Margen con el ahorro estimado</p><strong className="text-2xl text-emerald-900">{money(baseline + savings)} / ha</strong><p className="mt-1 text-sm font-semibold text-emerald-800">+{improvement} % respecto del margen base</p></div>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">Ahorro acumulado: {SAVINGS_SERIES.map((series) => `${series.label}: ${money(MONTHLY_SAVINGS.reduce((sum, month) => sum + month[series.key], 0) * 1000)} / ha`).join(' · ')}.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Prueba otros supuestos para tu temporada.</p>
        {onOpenSimulator ? <button type="button" onClick={onOpenSimulator} className={actionClass}><Sparkles className="h-4 w-4" aria-hidden="true" />Simular temporada</button> : <Link href="/simulador" className={actionClass}><Sparkles className="h-4 w-4" aria-hidden="true" />Simular temporada</Link>}
      </div>
    </section>
  );
}
