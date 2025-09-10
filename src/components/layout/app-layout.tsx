import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import { Header } from './header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="min-w-0 flex-1">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-2xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
