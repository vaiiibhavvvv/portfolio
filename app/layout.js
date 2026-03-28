import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Vaibhav Singh',
  description:
    'Creative Developer. I build immersive web experiences that blur the line between design and technology.',
  keywords: ['developer', 'portfolio', 'three.js', 'next.js', '3d', 'webgl'],
  openGraph: {
    title: 'Vaibhav Singh — Creative Developer',
    description: 'Crafting digital experiences beyond reality.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
