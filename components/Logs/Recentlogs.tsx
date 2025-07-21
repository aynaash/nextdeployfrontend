import Link from 'next/link';

export default function RecentLogs() {
  const logs = [
    {
      id: "1",
      timestamp: "2023-05-15T14:30:00Z",
      message: "Completed task #42",
      type: "success" as const,
      agent: "Sarah Johnson"
    },
    // ... other log items
  ];

  const logTypeColors = {
    info: "text-blue-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    success: "text-green-500",
  };

  const logTypeIcons = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
    success: "✅",
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs text-gray-500">
          Showing {logs.length} items
        </span>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <Link 
            href={`/logs/${log.id}`} 
            key={log.id}
            legacyBehavior
          >
            <a className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
              <span
                className={`text-sm mt-0.5 ${logTypeColors[log.type]}`}
                aria-label={log.type}
              >
                {logTypeIcons[log.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {log.message}
                  </p>
                  <time
                    className="text-xs text-gray-500 whitespace-nowrap"
                    dateTime={log.timestamp}
                  >
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                {log.agent && (
                  <p className="text-xs text-gray-500 mt-0.5">by {log.agent}</p>
                )}
              </div>
            </a>
          </Link>
        ))}
      </div>

      <Link href="/logs" legacyBehavior>
        <a className="w-full mt-3 text-xs text-blue-600 hover:text-blue-800 hover:underline block">
          View all logs →
        </a>
      </Link>
    </div>
  );
}
