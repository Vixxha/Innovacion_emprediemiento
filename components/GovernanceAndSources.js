import DataSources from './DataSources';
import DataPermissions from './DataPermissions';

export default function GovernanceAndSources() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7"><DataSources /></div>
      <div className="min-w-0 lg:col-span-5"><DataPermissions /></div>
    </div>
  );
}
