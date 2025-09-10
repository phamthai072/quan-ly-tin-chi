'use client';

import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="relative flex-1">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm toàn cục..."
        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
      />
    </div>
  );
}
