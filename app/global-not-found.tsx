import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Page Not Found | Your Website</title>
        <meta name="description" content="The page you're looking for doesn't exist or is in development." />
      </Head>
      
      <main className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for. This page either 
            doesn't exist or is currently in development.
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <Link 
            href="/"
            className="inline-block px-5 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go back home
          </Link>
          <a 
            href="mailto:support@yourwebsite.com"
            className="inline-block px-5 py-3 text-base font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Contact support
          </a>
        </div>
        
        <div className="mt-12">
          <div className="animate-bounce text-gray-400">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
