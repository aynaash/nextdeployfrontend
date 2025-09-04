'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Agents', href: '/agents', icon: '🖥️' },
    { name: 'Logs', href: '/logs', icon: '📝' },
    { name: 'Monitoring', href: '/monitoring', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className='w-64 bg-white shadow-md'>
      <div className='border-b p-4'>
        <h1 className='text-xl font-bold'>NextDeploy</h1>
      </div>
      <nav className='p-4'>
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} legacyBehavior>
                <Button
                  className={`flex items-center rounded-lg p-2 ${router.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
