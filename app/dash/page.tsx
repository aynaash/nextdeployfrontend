
import DashboardLayout from '../../components/layout/DashboardLayout';
import AgentStatusCards from '../../components/Agents/AgentCard.tsx';
import RecentLogs from '../../components/Logs/Recentlogs';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>
      
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentStatusCards />
        </div>
        <div>
          <RecentLogs />
        </div>
      </div>
    </DashboardLayout>
  );
}
