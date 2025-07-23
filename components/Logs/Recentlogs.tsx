import Link from 'next/link';

export default function RecentLogs() {
  const logs = [
    {
      id: '1',
      timestamp: '2023-05-15T14:30:00Z',
      message: 'Completed task #42',
      type: 'success' as const,
      agent: 'Sarah Johnson',
    },
    // ... other log items
  ];

  const logTypeColors = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    success: 'text-green-500',
  };

  const logTypeIcons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };

  return (
    <div className='h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='font-semibold text-gray-900'>Recent Activity</h3>
        <span className='text-xs text-gray-500'>Showing {logs.length} items</span>
      </div>

      <div className='space-y-3'>
        {logs.map((log) => (
          <Link href={`/logs/${log.id}`} key={log.id} legacyBehavior>
            <a className='flex items-start gap-3 rounded p-2 transition-colors hover:bg-gray-50'>
              <span className={`mt-0.5 text-sm ${logTypeColors[log.type]}`} aria-label={log.type}>
                {logTypeIcons[log.type]}
              </span>
              <div className='min-w-0 flex-1'>
                <div className='flex items-baseline justify-between gap-2'>
                  <p className='truncate text-sm font-medium text-gray-900'>{log.message}</p>
                  <time
                    className='whitespace-nowrap text-xs text-gray-500'
                    dateTime={log.timestamp}
                  >
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                {log.agent && <p className='mt-0.5 text-xs text-gray-500'>by {log.agent}</p>}
              </div>
            </a>
          </Link>
        ))}
      </div>

      <Link href='/logs' legacyBehavior>
        <a className='mt-3 block w-full text-xs text-blue-600 hover:text-blue-800 hover:underline'>
          View all logs →
        </a>
      </Link>
    </div>
  );
}
