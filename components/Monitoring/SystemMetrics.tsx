import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SystemMetricsProps {
  agents: any[];
}

export default function SystemMetrics({ agents }: SystemMetricsProps) {
  const [metrics, setMetrics] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // In a real app, you would get this data from your WebSocket connection
    const interval = setInterval(() => {
      const newMetrics: Record<string, any> = {};
      agents.forEach((agent) => {
        newMetrics[agent.id] = [
          {
            timestamp: new Date(),
            cpu: Math.random() * 100,
            memory: 30 + Math.random() * 70,
          },
          ...(metrics[agent.id] || []).slice(0, 59),
        ];
      });
      setMetrics(newMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, [agents, metrics]);

  if (agents.length === 0) {
    return <div className='py-8 text-center text-gray-500'>No agents connected</div>;
  }

  return (
    <div className='space-y-8'>
      {agents.map((agent) => (
        <div key={agent.id} className='rounded-lg bg-white p-4 shadow-sm'>
          <h3 className='mb-4 text-lg font-bold'>{agent.name} Metrics</h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <h4 className='mb-2 font-medium'>CPU Usage (%)</h4>
              <Line
                data={{
                  labels: metrics[agent.id]?.map((_, i) => i).reverse() || [],
                  datasets: [
                    {
                      label: 'CPU',
                      data: metrics[agent.id]?.map((m) => m.cpu).reverse() || [],
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  animation: {
                    duration: 0,
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                    },
                  },
                }}
              />
            </div>

            <div>
              <h4 className='mb-2 font-medium'>Memory Usage (%)</h4>
              <Line
                data={{
                  labels: metrics[agent.id]?.map((_, i) => i).reverse() || [],
                  datasets: [
                    {
                      label: 'Memory',
                      data: metrics[agent.id]?.map((m) => m.memory).reverse() || [],
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  animation: {
                    duration: 0,
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
