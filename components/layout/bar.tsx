'use client';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function Navbar() {
  const { isConnected } = useWebSocket();

  return (
    <header className='bg-white shadow-sm'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center space-x-4'>
          <span
            className={`inline-block h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className='flex items-center space-x-4'>
          <button className='rounded-full p-2 hover:bg-gray-100'>
            <span>🔔</span>
          </button>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white'>
            <span>👤</span>
          </div>
        </div>
      </div>
    </header>
  );
}
