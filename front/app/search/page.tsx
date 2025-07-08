// app/search/page.tsx
import { Suspense } from 'react';
import SearchInner from './SearchInner';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center py-8">読み込み中…</p>}>
      <SearchInner />
    </Suspense>
  );
}
