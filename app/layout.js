import './globals.css';
import DashboardShell from '../components/DashboardShell';

export const metadata = {
  title: 'CER Analytics · Manejo, Control y Rentabilidad del Predio',
  description: 'Dashboard agrícola de monitoreo de cuarteles, optimización de riego, reducción de costos y maximización de ganancias.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Raleway:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8faf7] text-slate-800 antialiased font-sans min-h-screen">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}

