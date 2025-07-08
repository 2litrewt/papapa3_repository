// app/search/page.tsx
import { Suspense } from 'react';
import SearchInner from './SearchInner';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results…</div>}>
      <SearchInner />
    </Suspense>
  );
}
