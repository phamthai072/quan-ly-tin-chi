'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navMenuItems, type NavMenuItem } from '@/config/nav-menu';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function NavMenu() {
  const pathname = usePathname();

  const renderMenuItem = (item: NavMenuItem) => {
    const isActive = item.href ? pathname.startsWith(item.href) : false;

    if (item.isHeader) {
      return <SidebarGroupLabel key={item.title}>{item.title}</SidebarGroupLabel>;
    }

    if (item.children) {
      return (
        <Accordion key={item.title} type="multiple" className="w-full">
          <AccordionItem value={item.title} className="border-none">
            <AccordionTrigger
              className={cn(
                'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&[data-state=open]>svg:last-child]:rotate-180',
                isActive &&
                  'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
              )}
            >
              {item.icon && <item.icon className="size-4 shrink-0" />}
              <span>{item.title}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <ul className="pl-6">
                {item.children.map((child) => (
                  <li key={child.title}>
                    <Link
                      href={child.href!}
                      className={cn(
                        'flex items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname === child.href &&
                          'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                      )}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
    
    return (
      <SidebarMenuItem key={item.title}>
        <Link href={item.href!} passHref legacyBehavior>
          <SidebarMenuButton
            as="a"
            isActive={isActive}
            tooltip={item.title}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarMenu>
      {navMenuItems.map((item) => renderMenuItem(item))}
    </SidebarMenu>
  );
}
