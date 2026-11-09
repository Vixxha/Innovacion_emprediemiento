'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Sprout, 
  Calculator, 
  ClipboardList, 
  Radio, 
  ShieldCheck, 
  Leaf, 
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { DASHBOARD_PAGES } from '../data/navigation';

const icons = { 
  overview: LayoutDashboard, 
  savings: TrendingUp, 
  parcels: Sprout, 
  calculator: Calculator, 
  operations: ClipboardList, 
  sources: Radio, 
  permissions: ShieldCheck, 
  alerts: Bell 
};

export default function Sidebar() {
  const pathname = usePathname();
  // State for mobile drawer toggle (open/closed)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for desktop sidebar collapse (expanded/compact)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Find active page title and icon
  const activePage = DASHBOARD_PAGES.find(item => item.href === pathname) || DASHBOARD_PAGES[0];
  const ActiveIcon = icons[activePage.icon] || LayoutDashboard;

  return (
    <aside 
      className={`bg-white border-b md:border-b-0 md:border-r border-emerald-100 shrink-0 print:hidden transition-all duration-200 z-30 ${
        isCollapsed ? 'md:w-20' : 'md:w-64'
      } md:h-screen md:sticky md:top-0 md:overflow-y-auto`}
    >
      {/* Top Header / Brand Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
        <Link 
          href="/" 
          className="flex items-center gap-3 group" 
          aria-label="CER Analytics, inicio"
        >
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
            <Leaf className="w-5 h-5 stroke-[2.5]" />
          </span>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="block text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                CER <span className="text-emerald-700">Analytics</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Manejo & Rentabilidad
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Toggle Button: Toggles the menu view */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all shadow-xs ${
              mobileMenuOpen 
                ? 'bg-emerald-700 text-white shadow-emerald-700/20' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-emerald-700" />
                <span>Menú</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
              </>
            )}
          </button>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Mobile Active Page Bar (Visible only when mobile menu is collapsed) */}
      <div className={`md:hidden px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs transition-all ${
        mobileMenuOpen ? 'hidden' : 'flex'
      }`}>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
            <ActiveIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-slate-500 font-medium">Sección activa:</span>
          <span className="text-emerald-800">{activePage.title}</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
        >
          <span>Cambiar sección</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation Buttons List / Grid */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isCollapsed ? 'Menú' : 'Secciones del Predio'}
            </p>
            {!isCollapsed && (
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                8 Herramientas
              </span>
            )}
          </div>

          <nav 
            aria-label="Navegación principal" 
            className={`grid ${
              isCollapsed ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-1.5'
            }`}
          >
            {DASHBOARD_PAGES.map(({ href, title, icon }) => {
              const Icon = icons[icon] || LayoutDashboard;
              const active = pathname === href;

              return (
                <Link 
                  key={href} 
                  href={href} 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? 'page' : undefined} 
                  title={isCollapsed ? title : undefined}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 border ${
                    active 
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm shadow-emerald-700/20 font-bold' 
                      : 'bg-white hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-950 border-slate-200/80 hover:border-emerald-300 shadow-2xs'
                  } ${isCollapsed ? 'justify-center px-2 py-3' : ''}`}
                >
                  <span className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-900'
                  }`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{title}</span>
                  )}

                  {!isCollapsed && active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick close button on mobile at bottom of menu */}
          <div className="md:hidden mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Ocultar menú</span>
            </button>
          </div>
        </div>

        {/* Season info card at bottom (desktop only) */}
        {!isCollapsed && (
          <div className="hidden md:block mx-3 my-4 p-3.5 rounded-xl bg-gradient-to-b from-emerald-50 to-[#f3f9f1] border border-emerald-100/90 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-emerald-950">Temporada 2026–2027</p>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900">
                CER Activo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">24 ha de cerezos · 6 cuarteles monitoreados</p>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-emerald-100/70">
              Predio de demostración con telemetría en tiempo real.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
