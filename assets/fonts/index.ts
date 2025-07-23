import localFont from 'next/font/local';

// Local fonts - paths are relative to this file
export const fontHeading = localFont({
  src: './CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

export const fontGeist = localFont({
  src: './GeistVF.woff2',
  variable: '--font-geist',
});

// Inter font configuration
export const fontSans = localFont({
  src: [
    {
      path: './Inter-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: './Inter-Italic-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});

// Urbanist font configuration
export const fontUrban = localFont({
  src: [
    {
      path: './Urbanist-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: './Urbanist-Italic-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-urban',
  display: 'swap',
});
