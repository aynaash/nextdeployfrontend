
"use client"
import { useWebSocket } from '../../hooks/useWebSocket';

export default function Navbar() {
  const { isConnected } = useWebSocket();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <span>🔔</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span>👤</span>
          </div>
        </div>
      </div>
    </header>
  );
}
