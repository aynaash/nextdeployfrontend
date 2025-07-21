import DashboardLayout from '../../components/layout/DashboardLayout.tsx';
import LogFilter from '../../components/Logs/LogFilter';
import LogViewer from '../../components/Logs/LogViewer';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function LogsPage() {
  const { agents, logs } = useWebSocket();
  const [filteredLogs, setFilteredLogs] = useState(logs);

  const handleFilterChange = (filters: any) => {
    setFilteredLogs(
      logs.filter(log => {
        return (
          (filters.agentId === '' || log.agentId === filters.agentId) &&
          (filters.level === 'all' || log.level === filters.level) &&
          (filters.search === '' || 
           log.message.toLowerCase().includes(filters.search.toLowerCase()))
        );
      })
    );
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Log Viewer</h1>
      <LogFilter agents={agents} onFilterChange={handleFilterChange} />
      <LogViewer logs={filteredLogs} />
    </DashboardLayout>
  );
}

