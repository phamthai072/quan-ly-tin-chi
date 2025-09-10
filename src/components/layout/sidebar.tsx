import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { NavMenu } from './nav-menu';
import { BookOpenCheck } from 'lucide-react';

export function AppSidebar() {
  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
           <BookOpenCheck className="w-8 h-8 text-primary" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-lg tracking-tight text-primary">
              CreditFlow
            </h2>
            <p className="text-xs text-muted-foreground">
              Hệ thống quản lý tín chỉ
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMenu />
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        {/* Footer content can go here */}
      </SidebarFooter>
    </>
  );
}
