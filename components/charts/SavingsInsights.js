'use client';

import ChartCard from './ChartCard';
import ResponsiveSvg from './ResponsiveSvg';
import { CHART_COLORS, formatNumber, niceMax, sumMonth } from './chartUtils';
import { MONTHLY_SAVINGS } from '../../data/farmData';

const categories = [
  { key: 'agua', label: 'Agua y riego' },
  { key: 'agroquimicos', label: 'Agroquímicos' },
  { key: 'horasHombre', label: 'Mano de obra' },
];

function DataTable({ caption, headings, rows }) {
  return <details className="rounded-lg border border-slate-200 p-3 text-xs">
    <summary className="cursor-pointer font-semibold text-slate-700">Ver datos: {caption}</summary>
    <div className="mt-3 overflow-x-auto"><table className="w-full text-right text-xs">
      <caption className="pb-2 text-left text-slate-600">{caption}. Miles de CLP/ha.</caption>
      <thead><tr>{headings.map((heading, index) => <th key={heading} scope="col" className={`border-b p-2 ${index === 0 ? 'text-left' : ''}`}>{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((value, index) => index === 0 ? <th key={index} scope="row" className="border-b border-slate-100 p-2 text-left font-medium">{value}</th> : <td key={index} className="border-b border-slate-100 p-2">{value}</td>)}</tr>)}</tbody>
    </table></div>
  </details>;
}

export function SavingsTrendChart({ months = MONTHLY_SAVINGS }) {
  if (!months?.length) return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No hay datos para mostrar la evolución del ahorro.</p>;
  let running = 0;
  const cumulative = months.map((month) => ({ ...month, cumulative: running += sumMonth(month) }));
  const total = running;
  const max = niceMax(total, 50);
  const ticks = Array.from({ length: max / 50 + 1 }, (_, index) => index * 50);

  return <ChartCard title={`El ahorro acumulado alcanza ${formatNumber(total)} mil CLP/ha`} subtitle="Evolución de la temporada · suma progresiva de los ahorros mensuales de demostración.">
      <ResponsiveSvg testId="savings-cumulative" height={280} title="Ahorro acumulado de la temporada" description={`Miles de CLP/ha, eje vertical desde cero. ${cumulative.map((month) => `${month.mes}: ${month.cumulative}`).join('; ')}.`}>
        {({ width }) => {
          const left = 36, right = 22, top = 28, bottom = 246;
          const x = (index) => left + index / Math.max(1, months.length - 1) * (width - left - right);
          const y = (value) => bottom - value / max * (bottom - top);
          const points = cumulative.map((month, index) => `${x(index)},${y(month.cumulative)}`).join(' ');
          return <>
            {ticks.map((tick) => <g key={tick}><line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? '#64748b' : '#e2e8f0'} /><text x={left - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#475569">{tick}</text></g>)}
            <polyline points={points} fill="none" stroke={CHART_COLORS.accent} strokeWidth="2.5" strokeLinejoin="round" />
            {cumulative.map((month, index) => <g key={month.mes}><circle data-value={month.cumulative} cx={x(index)} cy={y(month.cumulative)} r="4" fill={CHART_COLORS.accent} stroke="white" strokeWidth="1.5" /><text x={x(index)} y={y(month.cumulative) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">{month.cumulative}</text><text x={x(index)} y={bottom + 22} textAnchor="middle" fontSize="12" fill="#475569">{month.corto}</text></g>)}
          </>;
        }}
      </ResponsiveSvg>
      <p className="text-xs text-slate-600">Unidad: miles de CLP por hectárea. El acumulado incluye todos los meses hasta el punto indicado.</p>
      <DataTable caption="Ahorro acumulado" headings={['Mes', 'Mensual', 'Acumulado']} rows={cumulative.map((month) => [month.mes, sumMonth(month), month.cumulative])} />
    </ChartCard>;
}

export default function SavingsInsights({ months = MONTHLY_SAVINGS }) {
  if (!months?.length) return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No hay datos para mostrar el aporte por categoría.</p>;
  const total = months.reduce((sum, month) => sum + sumMonth(month), 0);
  const contributions = categories.map((category) => ({ ...category, total: months.reduce((sum, month) => sum + month[category.key], 0) }));
  const categoryMax = niceMax(Math.max(...contributions.map((category) => category.total)), 25);
  const categoryTicks = Array.from({ length: categoryMax / 25 + 1 }, (_, index) => index * 25);
  const largest = contributions.reduce((best, category) => category.total > best.total ? category : best);
  return <div className="grid min-w-0 gap-4 xl:grid-cols-2">
    <SavingsTrendChart months={months} />
    <ChartCard title={`${largest.label} aporta ${formatNumber(total ? largest.total / total * 100 : 0, 1)} % del ahorro`} subtitle={`Aporte por categoría al total de ${formatNumber(total)} mil CLP/ha · los porcentajes se calculan sobre la temporada completa.`}>
      <ResponsiveSvg testId="savings-contribution" height={280} title="Contribución por categoría al ahorro de temporada" description={contributions.map((category) => `${category.label}: ${category.total} mil CLP/ha, ${formatNumber(total ? category.total / total * 100 : 0, 1)} por ciento`).join('; ')}>
        {({ width }) => {
          const left = 4, right = width - 8, plotWidth = right - left;
          return <>
            {categoryTicks.map((tick) => <g key={tick}><line x1={left + tick / categoryMax * plotWidth} x2={left + tick / categoryMax * plotWidth} y1="26" y2="231" stroke={tick === 0 ? '#64748b' : '#e2e8f0'} /><text x={left + tick / categoryMax * plotWidth} y="252" textAnchor={tick === 0 ? 'start' : tick === categoryMax ? 'end' : 'middle'} fontSize="12" fill="#475569">{tick}</text></g>)}
            {contributions.map((category, index) => <g key={category.key}>
              <text x={left} y={18 + index * 78} fontSize="12" fill="#334155">{category.label}</text>
              <text x={right} y={18 + index * 78} textAnchor="end" fontSize="12" fontWeight="700" fill="#0f172a">{category.total} · {formatNumber(total ? category.total / total * 100 : 0, 1)} %</text>
              <rect data-category={category.key} data-value={category.total} x={left} y={30 + index * 78} width={category.total / categoryMax * plotWidth} height="27" rx="3" fill={CHART_COLORS[category.key]} />
            </g>)}
          </>;
        }}
      </ResponsiveSvg>
      <p className="text-xs text-slate-600">Unidad: miles de CLP por hectárea. Escala horizontal desde cero; los porcentajes pueden sumar 100,1 % por redondeo.</p>
      <DataTable caption="Aporte por categoría" headings={['Categoría', 'Ahorro', '% del total']} rows={[...contributions.map((category) => [category.label, category.total, `${formatNumber(total ? category.total / total * 100 : 0, 1)} %`]), ['Total', total, '100 %']]} />
    </ChartCard>
  </div>;
}
