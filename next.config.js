const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    globalNotFound: true,
  },
    images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
 webpack: (config, { webpack }) => {
    // Add IgnorePlugin
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );

    // Set up path aliases correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/app': path.resolve(__dirname, 'app'),
    };

    return config;
  },
};

// next.config.js is CommonJS but remark-frontmatter is ESM-only, so load it
// via dynamic import inside an async config export. Without it, the JS MDX
// compiler renders each doc's YAML frontmatter as a stray heading.
module.exports = async () => {
  const remarkFrontmatter = (await import('remark-frontmatter')).default;
  const withMDX = require('@next/mdx')({
    options: {
      remarkPlugins: [remarkFrontmatter],
      rehypePlugins: [],
    },
  });
  return withMDX(nextConfig);
};
