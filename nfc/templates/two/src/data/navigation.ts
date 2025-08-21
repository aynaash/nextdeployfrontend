import { NavigationSection } from '../types/navigation';

export const navigationData: NavigationSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: 'layoutDashboard', href: '/dashboard' },
      { label: 'Profile', icon: 'user', href: '/dashboard/profile' },
    ],
  },
  {
    title: 'Web Apps',
    items: [
      { 
        label: 'Email', 
        icon: 'mail',
        submenu: [
          { label: 'Inbox', icon: 'inbox', href: '/email/inbox' },
          { label: 'penLine', icon: 'pen', href: '/email/compose' },
        ],
      },
      { label: 'Calendar', icon: 'calendar', href: '/calendar' },
    ],
  },
  {
    title: 'Pages',
    items: [
      { label: 'Profile', icon: 'user', href: '/profile' },
      { label: 'Settings', icon: 'settings', href: '/settings' },
    ],
  },
  {
    title: 'General',
    items: [
      { label: 'Forms', icon: 'formInput', href: '/forms' },
      { label: 'UI Elements', icon: 'palette', href: '/ui-elements' },
    ],
  }
];