export default function AgentStatusCard() {
  // Static data
  const agent = {
    name: "Sarah Johnson",
    status: "online" as const,
    tasksCompleted: 42,
    responseTime: "0.4s",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-yellow-500",
    idle: "bg-blue-500",
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[agent.status]}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{agent.status}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="text-lg font-semibold text-gray-900">{agent.tasksCompleted}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-500">Response</p>
          <p className="text-lg font-semibold text-gray-900">{agent.responseTime}</p>
        </div>
      </div>
    </div>
  );
}
