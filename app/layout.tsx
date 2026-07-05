import { AuthProvider } from '@/context/AuthContext';
import { DateProvider } from '@/context/DateContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'VisionBoard',
  description: 'The ultimate task management and image annotation platform',
};

// Client ID একবারই define করা হয়েছে, যাতে এটি একাধিকবার define না হয়।
const GOOGLE_CLIENT_ID = "227007777660-5ihtn2ia72211l06bgtq3ppgrn53sn3a.apps.googleusercontent.com";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body className="font-sans antialiased bg-[#0a0a0f] text-white">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <DateProvider>
              {children}
            </DateProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}