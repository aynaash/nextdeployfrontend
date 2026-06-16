import { DocsConfig } from 'types';

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Guides',
      href: '/guides',
    },
  ],
  // Two tiers: "Guides" eases you in; "Technical Reference" goes deep. The docs
  // sidebar (components/docs-layout.tsx) and the prev/next pager both read this
  // list, so item order here defines the reading flow across the whole site.
  sidebarNav: [
    {
      title: 'Guides',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
        },
        {
          title: 'Installation',
          href: '/docs/installation',
        },
        {
          title: 'Quick Start',
          href: '/docs/quick-start',
        },
        {
          title: 'VPS Deployment',
          href: '/docs/vps-deployment',
        },
        {
          title: 'Cloudflare Deployment',
          href: '/docs/cloudflare-deployment',
        },
      ],
    },
    {
      title: 'Technical Reference',
      items: [
        {
          title: 'Configuration',
          href: '/docs/configuration',
        },
        {
          title: 'nextdeploy.yml Reference',
          href: '/docs/nextdeploy-yml',
        },
        {
          title: 'Secrets & Credentials',
          href: '/docs/secrets',
        },
        {
          title: 'Cloudflare Protection',
          href: '/docs/cloudflare-protection',
        },
      ],
    },
  ],
};
