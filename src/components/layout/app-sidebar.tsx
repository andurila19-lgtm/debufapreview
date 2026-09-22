'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navGroups } from '@/config/nav-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDebufaStore } from '@/lib/debufa-store';
import { can } from '@/lib/permissions';
import { Badge } from '@/components/ui/badge';

export default function AppSidebar() {
  const pathname = usePathname();
  const { currentUser } = useDebufaStore();

  // Filter groups and items based on central permission system
  const filteredNavGroups = React.useMemo(() => {
    return navGroups
      .map((group) => {
        const visibleItems = group.items.filter((item) => {
          if (!item.permission) return true;
          return can(currentUser, item.permission);
        });

        return {
          ...group,
          items: visibleItems
        };
      })
      .filter((group) => group.items.length > 0);
  }, [currentUser]);

  return (
    <Sidebar collapsible='icon' className='border-r border-border/60 bg-sidebar'>
      {/* Brand Header */}
      <SidebarHeader className='border-b border-border/40 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-800 text-amber-50 shadow-sm'>
            <Icons.hammer className='h-5 w-5' />
          </div>
          <div className='flex flex-col truncate leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='font-bold text-base tracking-tight text-foreground font-serif'>
              DEBUFA WORKS
            </span>
            <span className='text-[11px] text-muted-foreground font-medium'>
              Sistem Operasional Furniture Custom
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation with Centralized Role Filtering */}
      <SidebarContent className='overflow-x-hidden px-2 py-3'>
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.label || 'ungrouped'} className='py-1.5'>
            {group.label && (
              <SidebarGroupLabel className='px-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                const isActive =
                  pathname === item.url || (item.url !== '/admin' && pathname.startsWith(item.url));

                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={item.isActive}
                    render={<SidebarMenuItem />}
                  >
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className='group/collapsible hover:bg-accent/80'
                        />
                      }
                    >
                      {item.icon && (
                        <Icon className='h-4 w-4 text-amber-800/80 dark:text-amber-400' />
                      )}
                      <span className='font-medium text-sm'>{item.title}</span>
                      <Icons.chevronRight className='ml-auto transition-transform duration-200 group-data-panel-open/collapsible:rotate-90' />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={pathname === subItem.url}
                              render={<Link href={subItem.url} />}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      render={<Link href={item.url} />}
                      className={
                        isActive
                          ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200 font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }
                    >
                      {item.icon && (
                        <Icon
                          className={`h-4 w-4 ${
                            isActive
                              ? 'text-amber-800 dark:text-amber-300'
                              : 'text-muted-foreground'
                          }`}
                        />
                      )}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer Profile showing Current Active Role */}
      <SidebarFooter className='border-t border-border/40 p-3'>
        <div className='flex items-center gap-3 group-data-[collapsible=icon]:justify-center'>
          <Avatar className='h-9 w-9 border border-amber-800/30 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'>
            <AvatarFallback className='text-xs font-bold'>
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col truncate leading-tight group-data-[collapsible=icon]:hidden'>
            <div className='flex items-center gap-1.5'>
              <span className='text-xs font-semibold text-foreground truncate'>
                {currentUser.name}
              </span>
              <Badge
                variant={currentUser.role === 'OWNER' ? 'default' : 'secondary'}
                className={`text-[9px] px-1 py-0 h-4 font-bold ${
                  currentUser.role === 'OWNER'
                    ? 'bg-amber-800 hover:bg-amber-800 text-amber-50'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentUser.role}
              </Badge>
            </div>
            <div className='flex items-center gap-1.5 mt-0.5'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500'></span>
              <span className='text-[10px] text-muted-foreground truncate'>
                {currentUser.title ||
                  (currentUser.role === 'OWNER' ? 'Pemilik Usaha' : 'Admin Operasional')}
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
