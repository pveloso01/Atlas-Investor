import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/lib/store/StoreProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import EmotionRegistry from '@/lib/emotion/registry';
import NavBar from '@/components/Navigation/NavBar';
import Footer from '@/components/Layout/Footer';
import FeedbackButton from '@/components/Feedback/FeedbackButton';
import SupportWidget from '@/components/Support/SupportWidget';
import ErrorBoundary from '@/components/Shared/ErrorBoundary';
import { ToastProvider } from '@/lib/context/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas Investor - Real Estate Investment Platform for Portugal',
  description: 'Discover and analyze real estate investment opportunities in Portugal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EmotionRegistry>
          <StoreProvider>
            <ThemeProvider>
              <ToastProvider>
                <ErrorBoundary>
                  <NavBar />
                  {children}
                  <Footer />
                  <FeedbackButton />
                  <SupportWidget />
                </ErrorBoundary>
              </ToastProvider>
            </ThemeProvider>
          </StoreProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
