import localFont from 'next/font/local';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';

// Codex system — body/code is mono, headings are Space Grotesk.
// "Documentation that feels like you're SSH'd into the machine."
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const fontGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

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
