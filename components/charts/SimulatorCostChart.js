'use client';
import ChartCard from './ChartCard';
import ResponsiveSvg from './ResponsiveSvg';
import { CHART_COLORS, formatCLP, formatNumber, niceMax } from './chartUtils';

export default function SimulatorCostChart({ costs = [] }) {
  const base = costs.reduce((sum, cost) => sum + cost.base, 0);
  const scenario = costs.reduce((sum, cost) => sum + cost.scenario, 0);
  const saving = base - scenario;
  const max = niceMax(Math.max(0, ...costs.map(cost => cost.base / 1000)), 100);
  const chartHeight = costs.length * 96 + 44;
  if (!costs.length) return <p className="text-sm text-slate-500">No hay costos para comparar en este escenario.</p>;
  return <ChartCard title={`El escenario reduce ${formatNumber(base ? saving / base * 100 : 0, 1)} % los costos directos`} subtitle="CLP por hectárea · Comparación de temporada bajo los supuestos del simulador. Excluye otros costos fijos.">
    <div className="flex flex-wrap gap-4 text-xs text-slate-600"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-slate-500" />Base sin ahorro</span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.accent }} />Escenario CER</span></div>
    <ResponsiveSvg title="Costos por hectárea: base y escenario" description={costs.map(cost => `${cost.label}: base ${formatCLP(cost.base)}, escenario ${formatCLP(cost.scenario)}`).join('. ')} height={chartHeight} testId="simulator-costs">
      {({ width }) => {
        const left = 55, right = 64, plotWidth = Math.max(60, width - left - right);
        const scale = value => value / 1000 / max * plotWidth;
        const ticks = width < 440 ? [0, max / 2, max] : [0, max / 4, max / 2, max * 3 / 4, max];
        return <>
          {ticks.map(tick => <g key={tick}><line x1={left + tick / max * plotWidth} x2={left + tick / max * plotWidth} y1="24" y2={chartHeight - 28} stroke="#e2e8f0" /><text x={left + tick / max * plotWidth} y={chartHeight - 10} textAnchor="middle" fill="#475569" fontSize="12">{formatNumber(tick)}</text></g>)}
          {costs.map((cost, index) => {
            const top = index * 96 + 16;
            return <g key={cost.label}>
              <text x="0" y={top} fontSize="12" fontWeight="600" fill="#0f172a">{cost.label}</text>
              {[{ label: 'Base', value: cost.base, color: CHART_COLORS.context }, { label: 'CER', value: cost.scenario, color: CHART_COLORS.accent }].map((item, j) => <g key={item.label}>
                <text x="0" y={top + 26 + j * 27} fill="#475569" fontSize="12">{item.label}</text>
                <rect data-cost={cost.label} data-scenario={item.label} data-value={item.value} x={left} y={top + 12 + j * 27} width={scale(item.value)} height="19" rx="2" fill={item.color} />
                <text x={left + scale(item.value) + 5} y={top + 26 + j * 27} fill="#0f172a" fontSize="12" fontWeight="600">{formatNumber(item.value / 1000, 1)}</text>
              </g>)}
            </g>;
          })}
        </>;
      }}
    </ResponsiveSvg>
    <p className="text-xs text-slate-500">Escala horizontal en miles de CLP/ha, desde cero.</p>
    <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-950" aria-live="polite">Ahorro directo del escenario: <strong>{formatCLP(saving)} / ha</strong>. Base: {formatCLP(base)}; escenario: {formatCLP(scenario)} / ha.</p>
    <details className="text-sm"><summary className="cursor-pointer font-semibold text-slate-700">Ver datos de costos del escenario</summary><div className="overflow-x-auto mt-3"><table className="w-full min-w-[350px] text-xs text-right"><caption className="text-left text-slate-500 mb-2">Costos de temporada en CLP por hectárea. Datos calculados del simulador.</caption><thead><tr className="border-b"><th scope="col" className="py-2 text-left">Categoría</th><th scope="col">Base</th><th scope="col">Escenario</th><th scope="col">Ahorro</th></tr></thead><tbody>{costs.map(cost => <tr key={cost.label} className="border-b border-slate-100"><th scope="row" className="py-2 text-left font-medium">{cost.label}</th><td>{formatCLP(cost.base)}</td><td>{formatCLP(cost.scenario)}</td><td>{formatCLP(cost.base - cost.scenario)}</td></tr>)}</tbody><tfoot><tr className="font-bold"><th scope="row" className="py-2 text-left">Total directo</th><td>{formatCLP(base)}</td><td>{formatCLP(scenario)}</td><td>{formatCLP(saving)}</td></tr></tfoot></table></div></details>
  </ChartCard>;
}
