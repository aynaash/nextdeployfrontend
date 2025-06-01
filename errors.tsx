// 'use client';
//
// import { useEffect } from 'react';
// import { trackError } from '@/lib/error-tracking';
//
// export default function GlobalError({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     trackError(error, { type: 'client' });
//   }, [error]);
//
//   return (
//     <html>
//       <body>
//         <h2>Something went wrong!</h2>
//         <button onClick={() => reset()}>Try again</button>
//       </body>
//     </html>
//   );
// }
