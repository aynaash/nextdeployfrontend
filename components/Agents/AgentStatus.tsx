export default function AgentStatusCard() {
  // Static data
  const agent = {
    name: 'Sarah Johnson',
    status: 'online' as const,
    tasksCompleted: 42,
    responseTime: '0.4s',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-yellow-500',
    idle: 'bg-blue-500',
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <img
            src={agent.avatar}
            alt={agent.name}
            className='h-10 w-10 rounded-full object-cover'
          />
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[agent.status]}`}
          />
        </div>

        <div className='min-w-0 flex-1'>
          <h3 className='truncate font-medium text-gray-900'>{agent.name}</h3>
          <p className='text-sm capitalize text-gray-500'>{agent.status}</p>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-2 text-center'>
        <div className='rounded bg-gray-50 p-2'>
          <p className='text-sm font-medium text-gray-500'>Completed</p>
          <p className='text-lg font-semibold text-gray-900'>{agent.tasksCompleted}</p>
        </div>
        <div className='rounded bg-gray-50 p-2'>
          <p className='text-sm font-medium text-gray-500'>Response</p>
          <p className='text-lg font-semibold text-gray-900'>{agent.responseTime}</p>
        </div>
      </div>
    </div>
  );
}
