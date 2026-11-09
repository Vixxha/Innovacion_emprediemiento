'use client';

import { useState } from 'react';
import Link from 'next/link';
import ResponsiveSvg from './ResponsiveSvg';
import { MONTHLY_SAVINGS, FARM_INFO } from '../../data/farmData';
import { CHART_COLORS, formatCLP, sumMonth, niceMax } from './chartUtils';

export default function MainSavingsChart() {
  const [selected, setSelected] = useState(4);
  const totals = MONTHLY_SAVINGS.map(sumMonth);
  const maximum = niceMax(Math.max(...totals));
  const current = MONTHLY_SAVINGS[selected];
  const total = totals.reduce((sum, value) => sum + value, 0);
  return <figure className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-4 sm:p-6 space-y-5" aria-label="Gráfico principal de ahorro mensual">
    <figcaption className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Evolución de la temporada</p><h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">Ahorro mensual por hectárea</h2><p className="mt-2 text-sm text-slate-500">Septiembre–febrero · Datos de demostración</p></div>
      <div className="rounded-xl bg-emerald-50 px-4 py-3"><p className="text-xs text-emerald-900">Total de la temporada</p><p className="text-2xl font-extrabold text-emerald-900">{formatCLP(total * 1000)} <span className="text-sm font-medium">/ ha</span></p></div>
    </figcaption>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600"><span>Miles de CLP por hectárea</span><span className="font-semibold text-slate-800">Mayor ahorro: enero · 48 mil CLP/ha</span></div>
    <ResponsiveSvg testId="main-savings-bars" height={380} title="Ahorro mensual: enero registra el máximo de 48 mil CLP por hectárea" description={`Barras verticales desde cero en miles de CLP por hectárea. ${MONTHLY_SAVINGS.map((month, index) => `${month.mes}: ${totals[index]}`).join('; ')}. Consulta el detalle con los botones de mes o la tabla.`}>
      {({ width }) => {
        const left = 36, right = 12, top = 30, bottom = 338;
        const plotWidth = width - left - right;
        const step = plotWidth / MONTHLY_SAVINGS.length;
        const barWidth = Math.min(88, step * 0.65);
        const y = value => bottom - value / maximum * (bottom - top);
        return <>
          {Array.from({ length: maximum / 10 + 1 }, (_, index) => index * 10).map(tick => <g key={tick}><line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? '#94a3b8' : '#e2e8f0'} /><text x={left - 9} y={y(tick) + 4} textAnchor="end" fill="#64748b" fontSize="12">{tick}</text></g>)}
          {MONTHLY_SAVINGS.map((month, index) => {
            const x = left + step * index + (step - barWidth) / 2;
            return <g key={month.mes} aria-hidden="true" onClick={() => setSelected(index)} className="cursor-pointer">
              {selected === index && <rect x={x - 5} y={top - 12} width={barWidth + 10} height={bottom - top + 16} rx="7" fill="#eff6ff" />}
              <rect data-month={month.mes} data-value={totals[index]} x={x} y={y(totals[index])} width={barWidth} height={bottom - y(totals[index])} rx="4" fill={selected === index ? '#075985' : CHART_COLORS.accent} />
              <text x={x + barWidth / 2} y={y(totals[index]) - 10} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">{totals[index]}</text>
              <text x={x + barWidth / 2} y={bottom + 25} textAnchor="middle" fill="#475569" fontSize="12">{width < 600 ? month.corto : month.mes}</text>
            </g>;
          })}
        </>;
      }}
    </ResponsiveSvg>
    <div role="group" aria-label="Mes del gráfico principal" className="grid grid-cols-3 sm:grid-cols-6 gap-2">{MONTHLY_SAVINGS.map((month, index) => <button key={month.mes} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-11 rounded-lg border px-2 py-2 text-xs font-semibold ${selected === index ? 'border-sky-700 bg-sky-50 text-sky-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{month.mes}</button>)}</div>
    <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="text-sm font-bold text-slate-900">{current.mes}: {formatCLP(totals[selected] * 1000)} / ha</p><p className="mt-1 text-xs text-slate-500">{formatCLP(totals[selected] * 1000 * FARM_INFO.superficieTotal)} estimados para las {FARM_INFO.superficieTotal} ha del predio.</p></div><Link href="/ahorros" className="text-sm font-semibold text-sky-800 underline underline-offset-4">Ver desglose por categoría</Link></div>
    <details className="text-sm text-slate-600"><summary className="cursor-pointer font-semibold">Ver datos del gráfico principal</summary><table className="mt-3 w-full text-sm text-right"><caption className="mb-2 text-left text-xs">Ahorro mensual estimado, en miles de CLP/ha.</caption><thead><tr className="border-b"><th scope="col" className="py-2 text-left">Mes</th><th scope="col">Ahorro</th></tr></thead><tbody>{MONTHLY_SAVINGS.map((month, index) => <tr key={month.mes} className="border-b border-slate-100"><th scope="row" className="py-2 text-left font-medium">{month.mes}</th><td>{totals[index]}</td></tr>)}</tbody><tfoot><tr className="font-bold"><th scope="row" className="py-2 text-left">Temporada</th><td>{total}</td></tr></tfoot></table></details>
  </figure>;
}
