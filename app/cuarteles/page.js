import ParcelManagement from '../../components/ParcelManagement';
import ParcelCharts from '../../components/charts/ParcelCharts';
import WeatherFrostWidget from '../../components/WeatherFrostWidget';
import IrrigationControl from '../../components/IrrigationControl';
import { CUARTELES } from '../../data/farmData';

export const metadata = { title: 'Manejo y control | CER Analytics' };

export default function ParcelsPage({ searchParams }) {
  const requestedId = Number(searchParams?.cuartel);
  const selectedId = CUARTELES.some(parcel => parcel.id === requestedId) ? requestedId : 4;
  return (
    <div className="space-y-6">
      <WeatherFrostWidget />
      <ParcelCharts />
      <ParcelManagement key={selectedId} selectedId={selectedId} />
      <IrrigationControl />
    </div>
  );
}
