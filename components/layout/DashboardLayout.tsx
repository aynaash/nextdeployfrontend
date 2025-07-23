import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './bar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-y-auto p-4'>{children}</main>
      </div>
    </div>
  );
}
