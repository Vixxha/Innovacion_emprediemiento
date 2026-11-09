import ParcelManagement from '../../components/ParcelManagement';
import ParcelCharts from '../../components/charts/ParcelCharts';
import { CUARTELES } from '../../data/farmData';
export const metadata = { title: 'Manejo y control | CER Analytics' };
export default function ParcelsPage({ searchParams }) {
  const requestedId = Number(searchParams.cuartel);
  const selectedId = CUARTELES.some(parcel => parcel.id === requestedId) ? requestedId : 4;
  return <><ParcelCharts /><ParcelManagement key={selectedId} selectedId={selectedId} /></>;
}
