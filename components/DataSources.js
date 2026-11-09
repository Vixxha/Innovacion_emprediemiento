import { Radio, Wifi } from 'lucide-react';
import { FUENTES_DATOS } from '../data/farmData';

export default function DataSources() {
  return (
    <section id="fuentes" className="min-w-0 bg-white rounded-2xl border border-emerald-100/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Radio className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Fuentes de Datos & Sensores IoT
              </h2>
              <p className="text-xs text-slate-500">
                Modelo unificado de telemetría agroclimática y suelo
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {FUENTES_DATOS.filter((fuente) => fuente.status === 'ok').length} / {FUENTES_DATOS.length} Conectadas
          </span>
        </div>

        <div className="max-w-full overflow-x-auto rounded-xl border border-slate-200/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600" role="region" aria-label="Tabla de fuentes de datos, desplazamiento horizontal" tabIndex={0}>
          <table className="w-full min-w-[600px] text-left text-xs border-collapse">
            <caption className="sr-only">Fuentes de datos de demostración y estado de sus conexiones</caption>
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                <th scope="col" className="py-2.5 px-3.5">Dispositivo / Fuente</th>
                <th scope="col" className="py-2.5 px-3.5">Protocolo</th>
                <th scope="col" className="py-2.5 px-3.5">Última Lectura</th>
                <th scope="col" className="py-2.5 px-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FUENTES_DATOS.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800">
                    <span className="flex items-center gap-2"><Wifi aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-emerald-600" /><span>{f.nombre}</span></span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500">{f.tipo}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{f.ultimoDato}</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      f.status === 'ok' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {f.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500">Datos de demostración; los estados y las lecturas no provienen de sensores conectados en tiempo real.</p>
      </section>
  );
}
