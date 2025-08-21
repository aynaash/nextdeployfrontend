export interface NavigationSection {
  title: string;
  items: {
    label: string;
    icon: string;
    href?: string;
    submenu?: {
      label: string;
      icon: string;
      href: string;
    }[];
  }[];
} 