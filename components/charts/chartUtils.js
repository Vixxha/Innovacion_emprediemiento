export const CHART_COLORS = { agua: '#0072B2', agroquimicos: '#009E73', horasHombre: '#B35C00', accent: '#0072B2', context: '#64748b' };
export const formatCLP = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
export const formatNumber = (value, decimals = 0) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: decimals }).format(value);
export const sumMonth = (month) => month.agua + month.agroquimicos + month.horasHombre;
export function niceMax(value, step = 10) { return Math.max(step, Math.ceil(value / step) * step); }
