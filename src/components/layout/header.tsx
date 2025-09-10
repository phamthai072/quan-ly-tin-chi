import { SidebarTrigger } from '@/components/ui/sidebar';
import Search from '../ui/search-bar';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Tín Chỉ
        </h1>
      </div>
      <Search />
      <UserNav />
    </header>
  );
}
