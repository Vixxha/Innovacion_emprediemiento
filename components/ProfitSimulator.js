'use client';

import React, { useState } from 'react';
import SimulatorCostChart from './charts/SimulatorCostChart';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  RotateCcw, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const PRESETS = [
  { label: 'Actual (24 ha)', values: [24, 11500, 2800, 26, 21, 18] },
  { label: 'Mediano (12 ha)', values: [12, 10000, 2600, 26, 21, 18] },
  { label: 'Grande (50 ha)', values: [50, 13000, 3100, 26, 21, 18] },
];

export default function ProfitSimulator() {
  // Simulator State
  const [hectareas, setHectareas] = useState(24);
  const [rendimientoKgHa, setRendimientoKgHa] = useState(11500); // 11.5 tons/ha
  const [precioKg, setPrecioKg] = useState(2800); // $2.800 CLP por kg
  const [ahorroAguaPct, setAhorroAguaPct] = useState(26);
  const [ahorroAgroPct, setAhorroAgroPct] = useState(21);
  const [ahorroHorasPct, setAhorroHorasPct] = useState(18);

  // Baseline costs per ha without analytics (CLP)
  const costoAguaBaseHa = 380000; // costo hídrico + bombeo eléctrico por ha
  const costoAgroBaseHa = 350000; // fitosanitarios y fertilizantes
  const costoManoObraBaseHa = 260000; // cuadrillas y labores

  // Calculations
  const ahorroAguaHa = Math.round(costoAguaBaseHa * (ahorroAguaPct / 100));
  const ahorroAgroHa = Math.round(costoAgroBaseHa * (ahorroAgroPct / 100));
  const ahorroHorasHa = Math.round(costoManoObraBaseHa * (ahorroHorasPct / 100));
  
  const ahorroTotalHa = ahorroAguaHa + ahorroAgroHa + ahorroHorasHa;
  const ahorroTotalPredio = ahorroTotalHa * hectareas;

  const ingresoTotal = hectareas * rendimientoKgHa * precioKg;
  const costoTotalBase = hectareas * (costoAguaBaseHa + costoAgroBaseHa + costoManoObraBaseHa + 1200000); // otros costos fijos
  const costoTotalConCER = costoTotalBase - ahorroTotalPredio;

  const utilidadBase = ingresoTotal - costoTotalBase;
  const utilidadConCER = ingresoTotal - costoTotalConCER;
  const aumentoUtilidad = utilidadConCER - utilidadBase;
  const margenConCER = (utilidadConCER / ingresoTotal) * 100;
  const margenBase = (utilidadBase / ingresoTotal) * 100;
  const diferenciaMargen = margenConCER - margenBase;
  const currentValues = [hectareas, rendimientoKgHa, precioKg, ahorroAguaPct, ahorroAgroPct, ahorroHorasPct];
  const activePreset = PRESETS.find((preset) => preset.values.every((value, index) => value === currentValues[index]));

  const formatCLP = (val) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val).replace('CLP', '$');
  };

  const aplicarPreset = ([ha, rend, precio, agua, agro, horas]) => {
    setHectareas(ha);
    setRendimientoKgHa(rend);
    setPrecioKg(precio);
    setAhorroAguaPct(agua);
    setAhorroAgroPct(agro);
    setAhorroHorasPct(horas);
  };

  return (
    <section id="simulador" className="bg-white rounded-2xl border border-emerald-200/90 p-4 sm:p-6 shadow-xs space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Simulador: Manejo Eficiente, Ahorro y Mayores Ganancias
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Escenario de demostración. Ajuste los parámetros para comparar el ahorro y el margen operativo bajo estos supuestos.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Escenarios:</span>
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.label}
              onClick={() => aplicarPreset(preset.values)}
              aria-pressed={activePreset === preset}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${activePreset === preset ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {preset.label}
            </button>
          ))}
          <span role="status" className="text-xs font-semibold text-slate-600">
            {activePreset ? `Escenario: ${activePreset.label}` : 'Personalizado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Form (Left Column) */}
        <div className="lg:col-span-7 space-y-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Variables de Control del Predio
          </p>

          {/* Slider 1: Hectáreas */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Superficie Total del Predio</span>
              <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                {hectareas} hectáreas
              </span>
            </div>
            <input 
              type="range" aria-label="Superficie del predio en hectáreas" 
              min="4" 
              max="80" 
              step="1"
              value={hectareas}
              onChange={(e) => setHectareas(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>4 ha</span>
              <span>24 ha (Predio actual)</span>
              <span>80 ha</span>
            </div>
          </div>

          {/* Slider 2: Rendimiento kg/ha */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Rendimiento Estimado por Hectárea</span>
              <span className="font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {rendimientoKgHa.toLocaleString('es-CL')} kg / ha
              </span>
            </div>
            <input 
              type="range" aria-label="Rendimiento estimado en kg por hectárea" 
              min="7000" 
              max="16000" 
              step="500"
              value={rendimientoKgHa}
              onChange={(e) => setRendimientoKgHa(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>7.000 kg (Bajo)</span>
              <span>11.500 kg (Promedio)</span>
              <span>16.000 kg (Alto)</span>
            </div>
          </div>

          {/* Slider 3: Precio de Venta */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Precio Promedio de Venta (Exportación)</span>
              <span className="font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {formatCLP(precioKg)} / kg
              </span>
            </div>
            <input 
              type="range" aria-label="Precio de venta en CLP por kilogramo" 
              min="1800" 
              max="4200" 
              step="100"
              value={precioKg}
              onChange={(e) => setPrecioKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>$1.800 CLP</span>
              <span>$2.800 CLP (Estándar)</span>
              <span>$4.200 CLP (Premium)</span>
            </div>
          </div>

          {/* Sliders: Niveles de Ahorro y Eficiencia */}
          <div className="pt-2 border-t border-slate-200 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Niveles de Optimización con CER Analytics
            </p>

            {/* Ahorro Agua */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Ahorro en Agua y Electricidad de Riego:</span>
                <span className="font-bold text-sky-700">{ahorroAguaPct}% ({formatCLP(ahorroAguaHa)}/ha)</span>
              </div>
              <input 
                type="range" aria-label="Porcentaje de ahorro en agua" 
                min="10" 
                max="40" 
                value={ahorroAguaPct}
                onChange={(e) => setAhorroAguaPct(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Ahorro Agroquimicos */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Ahorro en Agroquímicos y Fertilizantes:</span>
                <span className="font-bold text-emerald-700">{ahorroAgroPct}% ({formatCLP(ahorroAgroHa)}/ha)</span>
              </div>
              <input 
                type="range" aria-label="Porcentaje de ahorro en agroquímicos" 
                min="10" 
                max="35" 
                value={ahorroAgroPct}
                onChange={(e) => setAhorroAgroPct(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Ahorro Horas */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Ahorro en Jornadas y Horas Hombre:</span>
                <span className="font-bold text-amber-700">{ahorroHorasPct}% ({formatCLP(ahorroHorasHa)}/ha)</span>
              </div>
              <input 
                type="range" aria-label="Porcentaje de ahorro en mano de obra" 
                min="5" 
                max="30" 
                value={ahorroHorasPct}
                onChange={(e) => setAhorroHorasPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Card (Right Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-emerald-900 to-green-950 text-white p-6 rounded-2xl shadow-md space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Impacto en Ganancias Netas
              </span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-emerald-200 font-semibold">
                Temporada Completa
              </span>
            </div>

            {/* Big Gain Display */}
            <div className="mt-5 space-y-1">
              <p className="text-xs text-emerald-200">Ahorro Directo Total del Predio:</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formatCLP(ahorroTotalPredio)}
              </p>
              <p className="text-xs text-emerald-300/90 font-medium pt-1">
                Equivalente a <strong className="text-white underline">{formatCLP(ahorroTotalHa)} por hectárea</strong> de ahorro estimado bajo estos supuestos.
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="mt-6 space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">Margen Operativo Tradicional:</span>
                <span className="font-bold text-white/80">{margenBase.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-300 font-semibold">Margen Operativo con CER:</span>
                <span className="font-extrabold text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                  {margenConCER.toFixed(1)}% (+{diferenciaMargen.toFixed(1)} puntos porcentuales)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">Ingreso Bruto de Cosecha:</span>
                <span className="font-bold text-white">{formatCLP(ingresoTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">Utilidad Neta Proyectada:</span>
                <span className="font-extrabold text-white text-base">{formatCLP(utilidadConCER)}</span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Supuestos de la simulación</span>
            </div>
            <p className="text-emerald-100/80 text-[11px] leading-relaxed">
              Se aplican los porcentajes elegidos a costos base de demostración. Los ingresos dependen de superficie, rendimiento y precio; los demás costos se mantienen fijos. Estos resultados no han sido verificados con datos del predio.
            </p>
          </div>
        </div>
      </div>
      <SimulatorCostChart costs={[
        { label: 'Agua y riego', base: costoAguaBaseHa, scenario: costoAguaBaseHa - ahorroAguaHa },
        { label: 'Agroquímicos', base: costoAgroBaseHa, scenario: costoAgroBaseHa - ahorroAgroHa },
        { label: 'Mano de obra', base: costoManoObraBaseHa, scenario: costoManoObraBaseHa - ahorroHorasHa },
      ]} />
    </section>
  );
}

