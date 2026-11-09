'use client';

import Link from 'next/link';
import { CUARTELES } from '../../data/farmData';
import ChartCard from './ChartCard';
import ResponsiveSvg from './ResponsiveSvg';
import { formatCLP, formatNumber } from './chartUtils';

const BLUE = '#0072B2';
const ORANGE = '#A65300';
const parcels = CUARTELES.map((parcel) => {
  const [minimum, maximum] = parcel.humedadMeta.match(/\d+(?:[.,]\d+)?/g).map((value) => Number(value.replace(',', '.')));
  return { ...parcel, minimum, maximum, outside: parcel.humedadSuelo < minimum || parcel.humedadSuelo > maximum };
});
const rankedParcels = [...parcels].sort((a, b) => b.ahorroEstimadoHa - a.ahorroEstimadoHa);

function ParcelTable({ savings }) {
  return <details className="text-xs text-slate-700">
    <summary className="cursor-pointer rounded py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700">Ver datos y abrir detalle del cuartel</summary>
    <div className="mt-2 max-w-full overflow-x-auto rounded-lg border border-slate-200" role="region" aria-label={savings ? 'Tabla de ahorro por cuartel' : 'Tabla de humedad por cuartel'} tabIndex={0}>
      <table className="w-full min-w-[400px] text-left text-xs">
        <caption className="sr-only">{savings ? 'Ahorro estimado, de mayor a menor' : 'Humedad actual frente al objetivo'}</caption>
        <thead className="bg-slate-50"><tr><th scope="col" className="p-3">Cuartel</th>{savings ? <th scope="col" className="p-3 text-right">CLP por ha</th> : <><th scope="col" className="p-3">Actual</th><th scope="col" className="p-3">Objetivo</th><th scope="col" className="p-3">Situación</th></>}</tr></thead>
        <tbody>{(savings ? rankedParcels : parcels).map((p) => <tr key={p.id} className="border-t border-slate-100"><th scope="row" className="p-3 font-medium"><Link href={`/cuarteles?cuartel=${p.id}`} className="rounded text-sky-800 underline underline-offset-2 focus-visible:outline focus-visible:outline-2">{p.nombre}</Link></th>{savings ? <td className="p-3 text-right tabular-nums">{formatCLP(p.ahorroEstimadoHa)}</td> : <><td className="p-3">{p.humedadSuelo} %</td><td className="p-3 whitespace-nowrap">{p.minimum}–{p.maximum} %</td><td className="p-3">{p.outside ? 'Fuera del objetivo' : 'Dentro del objetivo'}</td></>}</tr>)}</tbody>
      </table>
    </div>
  </details>;
}

function ParcelChart({ savings = false }) {
  const rows = savings ? rankedParcels : parcels;
  const outsideCount = parcels.filter(parcel => parcel.outside).length;
  const title = savings ? `Cuartel ${rankedParcels[0].numero} lidera con ${formatNumber(rankedParcels[0].ahorroEstimadoHa / 1000)} mil CLP/ha` : `${outsideCount} de ${parcels.length} cuarteles fuera del rango de humedad`;
  const description = savings
    ? rows.map((p) => `Cuartel ${p.numero}: ${formatCLP(p.ahorroEstimadoHa)} por hectárea.`).join(' ')
    : rows.map((p) => `Cuartel ${p.numero}: ${p.humedadSuelo} %, objetivo ${p.minimum} a ${p.maximum} %; ${p.outside ? 'fuera del rango' : 'dentro del rango'}.`).join(' ');
  return <ChartCard title={title} subtitle={savings ? 'Ranking de cuarteles · miles de CLP por ha · datos de demostración.' : 'Porcentaje de humedad por cuartel · datos de demostración.'}>
    <p className="text-xs leading-relaxed text-slate-600">{savings ? 'Barras azules: estimación por hectárea para cada cuartel. Mayor longitud indica mayor ahorro estimado.' : 'Banda gris: rango objetivo. Círculo azul: lectura dentro del rango. Rombo ocre: lectura fuera del rango.'}</p>
    <ResponsiveSvg title={title} description={description} height={388} testId={savings ? 'parcel-savings' : 'parcel-moisture'}>
      {({ width }) => {
        const left = 76, right = width - (savings ? 38 : 43), top = 29, bottom = 340;
        const maximum = savings ? 250 : 40;
        const ticks = savings ? [0, 50, 100, 150, 200, 250] : [0, 10, 20, 30, 40];
        const x = (value) => left + (value / maximum) * (right - left);
        return <g fontSize={12} fill="#334155">
          {ticks.map((tick) => <g key={tick}><line x1={x(tick)} x2={x(tick)} y1={14} y2={bottom} stroke="#e2e8f0" /><text x={x(tick)} y={bottom + 20} textAnchor="middle">{tick}</text></g>)}
          {rows.map((p, index) => {
            const y = top + index * 51;
            const value = savings ? p.ahorroEstimadoHa / 1000 : p.humedadSuelo;
            const point = x(value);
            return <g key={p.id}>
              <text x={0} y={y + 4}>Cuartel {p.numero}</text>
              {savings ? <><rect x={left} y={y - 10} width={point - left} height={20} rx={3} fill={BLUE} /><text x={point + 5} y={y + 4} fontWeight={700}>{formatNumber(value)}</text></> : <>
                <rect x={x(p.minimum)} y={y - 9} width={x(p.maximum) - x(p.minimum)} height={18} rx={3} fill="#cbd5e1" stroke="#64748b" />
                {p.outside ? <path d={`M ${point} ${y - 7} l 7 7 l -7 7 l -7 -7 Z`} fill={ORANGE} stroke="white" strokeWidth={1.5} /> : <circle cx={point} cy={y} r={6} fill={BLUE} stroke="white" strokeWidth={1.5} />}
                <text x={width - 1} y={y + 4} textAnchor="end" fill={p.outside ? ORANGE : BLUE} fontWeight={700}>{value} %</text>
                <text x={left} y={y + 26} fill="#475569">Meta {p.minimum}–{p.maximum} %</text>
              </>}
            </g>;
          })}
          <text x={(left + right) / 2} y={382} textAnchor="middle">{savings ? 'Miles de CLP por ha' : 'Humedad del suelo (%)'}</text>
        </g>;
      }}
    </ResponsiveSvg>
    <p className="text-xs leading-relaxed text-slate-700">{savings ? 'Estimaciones propias de cada cuartel; no se suman ni se comparan con la serie mensual del predio.' : 'Cuartel 2: 19 %, por debajo del objetivo de 28–34 %. Los otros cinco cuarteles están dentro de su rango.'}</p>
    <ParcelTable savings={savings} />
  </ChartCard>;
}

export default function ParcelCharts() {
  return <section aria-label="Gráficos comparativos de cuarteles" className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2"><ParcelChart /><ParcelChart savings /></section>;
}
