'use client';

import React from 'react';
import { VendorShell } from '@/components/vendor/VendorShell';

export default function VendorProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorShell>
      {children}
    </VendorShell>
  );
}
