'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LegacyProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/admin/pesanan/${params.id}`);
    } else {
      router.replace('/admin/pesanan');
    }
  }, [params, router]);

  return <div className='p-8 text-xs text-muted-foreground'>Mengalihkan ke detail pesanan...</div>;
}
