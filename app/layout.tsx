import type { Metadata } from 'next';
import './globals.css';
import { ERPProvider } from '@/context/ERPContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Hello Academy Pontianak - Enterprise Multi-Branch Education ERP',
  description: 'Sistem Informasi Manajemen Pendidikan Terpadu (27 Modul Operasional)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <ERPProvider>
          <AppShell>{children}</AppShell>
        </ERPProvider>
      </body>
    </html>
  );
}
