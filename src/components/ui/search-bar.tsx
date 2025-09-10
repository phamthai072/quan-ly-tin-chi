'use client';

import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (inputValue) {
        params.set('q', inputValue);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, pathname, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}
