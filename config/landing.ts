import { FeatureLdg, InfoLdg, TestimonialType } from '../types/index';

export const infos: InfoLdg[] = [
  {
    title: 'Empower Your Deployments',
    description:
      'Unlock the full potential of your deployments with our platform. Scale effortlessly, monitor performance in real time, and streamline your workflow from development to production.',
    image: '/_static/illustrations/work-from-home.jpg',
    list: [
      {
        title: 'Collaborative',
        description: 'Work in sync with your team to deploy updates seamlessly.',
        icon: 'laptop',
      },
      {
        title: 'Innovative',
        description: 'Stay ahead with constant updates and cutting-edge deployment features.',
        icon: 'settings',
      },
      {
        title: 'Scalable',
        description:
          'Our platform grows with you, providing the flexibility to handle your growing deployment needs.',
        icon: 'search',
      },
    ],
  },
  {
    title: 'Seamless Integration',
    description:
      'Easily integrate NextDeploy with your favorite tools and services for a smooth deployment pipeline. Connect with version control systems, cloud providers, and monitoring tools effortlessly.',
    image: '/_static/illustrations/integrations.jpg', // Replace with appropriate image
    list: [
      {
        title: 'Flexible',
        description: "Customizable integrations to fit your project's unique needs.",
        icon: 'laptop',
      },
      {
        title: 'Efficient',
        description: 'Automate your deployment pipeline for faster delivery.',
        icon: 'search',
      },
      {
        title: 'Reliable',
        description: 'Trust our robust infrastructure to keep your deployments running smoothly.',
        icon: 'settings',
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: 'Continuous Deployment',
    description:
      'Effortlessly deploy your Next.js apps with our automated deployment pipelines. Trigger deployments directly from your Git repository and ensure fast, reliable updates.',
    link: '/features/continuous-deployment',
    icon: 'nextjs',
  },
  {
    title: 'Real-Time Monitoring',
    description:
      'Track deployment performance with real-time analytics. Get instant feedback and insights into your app’s performance post-deployment.',
    link: '/features/real-time-monitoring',
    icon: 'google',
  },
  {
    title: 'Seamless Integrations',
    description:
      'Integrate with cloud providers, version control systems, and more to create an end-to-end deployment solution.',
    link: '/features/integrations',
    icon: 'gitHub',
  },
  {
    title: 'Customizable Pipelines',
    description:
      'Create and configure deployment pipelines that suit your team’s workflow. Build custom automation to fit your needs.',
    link: '/features/custom-pipelines',
    icon: 'laptop',
  },
  {
    title: 'Scalable Infrastructure',
    description:
      'Scale your deployment infrastructure automatically as your app grows. Easily manage resources to ensure optimal performance.',
    link: '/features/scalability',
    icon: 'user',
  },
  {
    title: 'Advanced Security',
    description:
      'Keep your deployments secure with integrated security features such as encryption, SSH, and more.',
    link: '/features/security',
    icon: 'copy',
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: 'John Doe',
    job: 'Full Stack Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    review:
      'NextDeploy has transformed how we manage our deployments. The integration with GitHub allows us to automatically deploy every time we push, making our workflow faster and more efficient. The real-time monitoring helps us detect issues instantly, and we love the scalability options as our app grows.',
  },
  {
    name: 'Alice Smith',
    job: 'UI/UX Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    review:
      'NextDeploy has given us the ability to easily integrate deployments with our existing tools. The flexibility of custom pipelines means we can tailor the deployment process to our needs, allowing us to focus on the design aspects.',
  },
  {
    name: 'David Johnson',
    job: 'DevOps Engineer',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    review:
      'I’ve used many deployment tools, but NextDeploy has been a game-changer. It’s incredibly reliable and offers seamless integration with AWS and Docker, making the deployment process much smoother. Plus, the monitoring tools allow us to optimize performance in real-time.',
  },
  {
    name: 'Michael Wilson',
    job: 'Project Manager',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    review:
      'NextDeploy has made it incredibly easy for our team to manage deployments. The customizable pipelines and seamless integrations help us work faster, and the 24/7 support ensures that we always have help when we need it.',
  },
  {
    name: 'Sophia Garcia',
    job: 'Data Analyst',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    review:
      'NextDeploy gave me the tools I needed to streamline our deployment and analytics processes. The integration with our existing systems was seamless, and the real-time insights help us improve the app’s performance continuously.',
  },
  {
    name: 'Emily Brown',
    job: 'Marketing Manager',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    review:
      'With NextDeploy, we can easily manage deployments and monitor our app’s performance in real time. The ease of integration with our marketing tools has made our campaign deployments much more efficient.',
  },
  {
    name: 'Jason Stan',
    job: 'Web Designer',
    image: 'https://randomuser.me/api/portraits/men/9.jpg',
    review:
      'Thanks to NextDeploy, we’ve been able to automate much of our deployment process. It integrates perfectly with our CI/CD pipeline and ensures our updates are deployed seamlessly. The whole team loves how easy it is to use.',
  },
];
