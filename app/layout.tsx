import type { Metadata } from 'next';
import './globals.css';
import { ERPProvider } from '@/context/ERPContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Bsmart Education Pontianak - Enterprise Multi-Branch Education Portal',
  description: 'Sistem Informasi Manajemen Pendidikan Terpadu (27 Modul Operasional)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
        <ERPProvider>
          <AppShell>{children}</AppShell>
        </ERPProvider>
      </body>
    </html>
  );
}
