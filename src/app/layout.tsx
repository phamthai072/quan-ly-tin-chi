import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/app-layout';
import { LoggerProvider } from '@/contexts/logger-context';
import { Logger } from '@/components/logger/logger';

export const metadata: Metadata = {
  title: 'Quản lý tín chỉ',
  description: 'Đề tài 8 - Lớp M25CQIS02',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <LoggerProvider>
          <AppLayout>{children}</AppLayout>
          <Logger />
        </LoggerProvider>
        <Toaster />
      </body>
    </html>
  );
}
