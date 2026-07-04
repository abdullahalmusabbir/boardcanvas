import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DateProvider } from '@/context/DateContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: '404 — Task & Annotate',
  description: 'The ultimate task management and image annotation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body className="font-sans antialiased bg-[#0a0a0f] text-white">
        <AuthProvider>
          <DateProvider>
            {children}
          </DateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}