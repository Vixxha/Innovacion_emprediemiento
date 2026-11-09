'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CHART_COLORS } from './charts/chartUtils';

export const SAVINGS_SERIES = [
  { key: 'agua', label: 'Agua y riego', color: CHART_COLORS.agua },
  { key: 'agroquimicos', label: 'Agroquímicos', color: CHART_COLORS.agroquimicos },
  { key: 'horasHombre', label: 'Mano de obra', color: CHART_COLORS.horasHombre },
];
export const monthlyTotal = (month) => SAVINGS_SERIES.reduce((sum, series) => sum + month[series.key], 0);
const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

export default function SavingsChart({ months = [], hectares = 0 }) {
  const chartContainer = useRef(null);
  const [chartWidth, setChartWidth] = useState(690);
  const [selected, setSelected] = useState(Math.min(4, months.length - 1));
  const id = useId();
  useEffect(() => {
    const container = chartContainer.current;
    if (!container) return;
    const updateWidth = () => setChartWidth(Math.max(200, container.getBoundingClientRect().width));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, [months.length]);
  const current = months[selected] || months[0];
  const totals = months.map(monthlyTotal);
  const max = Math.max(10, Math.ceil(Math.max(...totals) / 10) * 10);
  const ticks = Array.from({ length: max / 10 + 1 }, (_, index) => index * 10);
  const left = 36, top = 32, plotHeight = 340, bottom = top + plotHeight, plotWidth = chartWidth - left - 16;
  const step = plotWidth / months.length;
  const barWidth = step * 0.56;
  const y = (value) => bottom - value / max * plotHeight;

  if (!current) return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No hay datos de ahorro para este período.</p>;

  return (
    <div className="min-w-0 space-y-4">
      <p className="text-sm font-semibold text-slate-800">{months[totals.indexOf(Math.max(...totals))].mes} concentra el mayor ahorro mensual: {Math.max(...totals)} mil CLP/ha.</p>
      <ul aria-label="Categorías de ahorro" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">{SAVINGS_SERIES.map((series) => <li key={series.key} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ backgroundColor: series.color }} aria-hidden="true" />{series.label}</li>)}</ul>
      <p className="text-xs font-medium text-slate-600">Miles de CLP por hectárea (CLP/ha)</p>
      <div ref={chartContainer} className="w-full min-w-0">
      <svg viewBox={`0 0 ${chartWidth} 405`} role="img" aria-labelledby={`${id}-title ${id}-description`} className="block h-[405px] w-full">
        <title id={`${id}-title`}>Ahorro mensual por hectárea, de septiembre a febrero</title>
        <desc id={`${id}-description`}>Barras apiladas con eje vertical desde cero, en miles de CLP por hectárea. {months.map((month, index) => `${month.mes}: ${totals[index]}`).join('; ')}. Selecciona un mes con los botones inferiores o consulta la tabla de datos.</desc>
        {ticks.map((tick) => <g key={tick}><line x1={left} x2={left + plotWidth} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? '#64748b' : '#e2e8f0'} strokeWidth={tick === 0 ? 1.5 : 1} /><text x={left - 10} y={y(tick) + 4} textAnchor="end" fill="#475569" fontSize="12">{tick}</text></g>)}
        {months.map((month, index) => {
          const x = left + step * index + (step - barWidth) / 2;
          let accumulated = 0;
          return <g key={month.mes} onClick={() => setSelected(index)} className="cursor-pointer" aria-hidden="true">
            {selected === index && <rect x={x - 5} y={top - 8} width={barWidth + 10} height={plotHeight + 12} rx="6" fill="#ecfdf5" />}
            {SAVINGS_SERIES.map((series) => {
              const value = month[series.key];
              accumulated += value;
              return <rect key={series.key} data-series={series.key} data-value={value} x={x} y={y(accumulated)} width={barWidth} height={value / max * plotHeight} fill={series.color} />;
            })}
            <text x={x + barWidth / 2} y={y(totals[index]) - 8} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">{totals[index]}</text>
            <text x={x + barWidth / 2} y={bottom + 23} textAnchor="middle" fill="#475569" fontSize="12">{month.corto}</text>
          </g>;
        })}
      </svg>
      </div>
      <div role="group" aria-label="Seleccionar mes del ahorro" className="grid grid-cols-3 gap-2 sm:grid-cols-6">{months.map((month, index) => <button type="button" key={month.mes} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-controls={`${id}-detail`} className={`min-h-[44px] rounded-lg border px-2 py-2 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${selected === index ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{month.mes}</button>)}</div>
      <div id={`${id}-detail`} aria-live="polite" aria-atomic="true" className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-bold text-slate-900">{current.mes}: {money(monthlyTotal(current) * 1000)} / ha</h3><span className="text-xs text-slate-600">{current.etapa}</span></div>
        <dl className="grid gap-3 sm:grid-cols-3">{SAVINGS_SERIES.map((series) => <div key={series.key}><dt className="text-xs text-slate-600">{series.label}</dt><dd className="font-semibold text-slate-900">{money(current[series.key] * 1000)} / ha</dd></div>)}</dl>
        <p className="text-xs text-slate-600">Equivalente a {money(monthlyTotal(current) * 1000 * hectares)} para las {hectares} ha del predio. Estimación de demostración.</p>
      </div>
      <details className="rounded-xl border border-slate-200 p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">Ver tabla de datos del gráfico</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] text-right text-xs">
            <caption className="pb-3 text-left text-slate-600">Ahorros estimados en miles de CLP/ha. Total calculado como suma de las tres categorías.</caption>
            <thead><tr className="border-b border-slate-200"><th scope="col" className="p-2 text-left">Mes</th>{SAVINGS_SERIES.map((series) => <th scope="col" key={series.key} className="p-2">{series.label}</th>)}<th scope="col" className="p-2">Total</th></tr></thead>
            <tbody>{months.map((month) => <tr key={month.mes} className="border-b border-slate-100"><th scope="row" className="p-2 text-left font-medium">{month.mes}</th>{SAVINGS_SERIES.map((series) => <td key={series.key} className="p-2">{month[series.key]}</td>)}<td className="p-2 font-semibold">{monthlyTotal(month)}</td></tr>)}</tbody>
            <tfoot><tr className="font-bold"><th scope="row" className="p-2 text-left">Temporada</th>{SAVINGS_SERIES.map((series) => <td key={series.key} className="p-2">{months.reduce((sum, month) => sum + month[series.key], 0)}</td>)}<td className="p-2">{totals.reduce((sum, total) => sum + total, 0)}</td></tr></tfoot>
          </table>
        </div>
      </details>
    </div>
  );
}
