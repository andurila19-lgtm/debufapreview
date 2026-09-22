import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { ThemeModeToggle } from '../themes/theme-mode-toggle';
import { NotificationCenter } from './notification-center';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <header className='bg-background/60 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-md md:h-14'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4 data-vertical:self-center' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='hidden sm:flex items-center gap-1.5'>
          <a
            href='/tracking'
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-foreground/80 hover:bg-muted transition-colors'
          >
            <span>Tracking Portal</span>
          </a>
        </div>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <ThemeModeToggle />
        <NotificationCenter />
        <UserNav />
      </div>
    </header>
  );
}
