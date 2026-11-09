'use client';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { DASHBOARD_PAGES } from '../data/navigation';
export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const page = DASHBOARD_PAGES.find(item => item.href === pathname) || DASHBOARD_PAGES[0];
  return <div className="min-h-screen flex flex-col md:flex-row bg-[#f8faf7]">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Sidebar />
    <div className="flex-1 min-w-0">
      <Header title={page.title} description={page.description} onOpenSimulator={() => router.push('/simulador')} />
      <main id="contenido" tabIndex={-1} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">{children}</main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 border-t border-emerald-100">CER Analytics · Temporada 2026–2027 · Datos de demostración</footer>
    </div>
  </div>;
}
