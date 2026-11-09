export default function ChartCard({ title, subtitle, children, className = '' }) {
  return <figure className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 ${className}`}>
    <figcaption><h3 className="text-base font-bold leading-snug text-slate-900">{title}</h3>{subtitle && <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>}</figcaption>
    {children}
  </figure>;
}
