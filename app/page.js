import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import KpiCards from '../components/KpiCards';
import MainSavingsChart from '../components/charts/MainSavingsChart';
import DashboardOrganizer from '../components/DashboardOrganizer';
import { DASHBOARD_PAGES } from '../data/navigation';
export const metadata = { title: 'Resumen general | CER Analytics' };
export default function DashboardPage() {
  return <DashboardOrganizer blocks={[
    { id: 'indicadores', label: 'Indicadores del predio', content: <KpiCards /> },
    { id: 'grafico', label: 'Gráfico principal', content: <MainSavingsChart /> },
    { id: 'herramientas', label: 'Herramientas del predio', content: <section aria-labelledby="herramientas" className="space-y-4">
      <div><h2 id="herramientas" className="text-xl font-bold text-slate-900">Herramientas del predio</h2><p className="text-sm text-slate-500 mt-1">Abre una sección para ver su detalle y trabajar con sus datos.</p></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {DASHBOARD_PAGES.filter(page => page.href !== '/').map(page => <Link key={page.href} href={page.href} className="block rounded-2xl border border-emerald-100 bg-white p-5 hover:border-emerald-500 hover:shadow-sm transition-colors">
          <div className="flex justify-between gap-3"><h3 className="font-bold text-slate-900">{page.title}</h3><ArrowUpRight className="w-5 h-5 shrink-0 text-emerald-700" /></div>
          <p className="text-sm text-slate-500 mt-2">{page.description}</p>
        </Link>)}
      </div>
    </section> },
  ]} />;
}
