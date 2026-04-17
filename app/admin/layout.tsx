import { AdminShell } from '@/components/admin/AdminShell';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | TrestBiyyo',
  description: 'Marketplace command center for platform administration.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminGuard>
  );
}
