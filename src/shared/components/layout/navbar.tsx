'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, Link } from '@/src/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/src/shared/providers/auth-context';
import { useLogout } from '@/src/features/auth/hooks/use-auth-query';
import { Menu, Languages, User, LogOut, Kanban } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { ThemeToggle } from '@/src/shared/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/src/shared/components/ui/sheet';
import { Sidebar } from './sidebar';
import { Badge } from '@/src/shared/components/ui/badge';
import { APP_ROUTES } from '@/src/shared/constans/routes';

export function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
  const t = useTranslations('navigation');
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoutMutation = useLogout();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md transition-all sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-muted-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="p-0 w-72 max-w-[85vw] border-border overflow-hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar onNavigateMobile={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="lg:hidden flex items-center gap-2 font-bold text-lg text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xs">
            <Kanban className="h-4 w-4" />
          </div>
          <span>Done</span>
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* Language switcher */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="h-9 gap-1.5 px-2.5 text-xs font-medium border-border/60 hover:bg-muted"
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="uppercase">{locale === 'ar' ? 'English' : 'عربي'}</span>
        </Button>

        {/* User Profile Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 ring-offset-background transition-transform active:scale-95"
              >
                <UserAvatar user={user} sizeClassName="h-9 w-9" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 border-border">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none truncate max-w-[130px]">{user.name}</p>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-mono py-0 px-1.5 bg-primary/10 text-primary border-primary/20 shrink-0"
                    >
                      {role}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer gap-2">
                <Link href={APP_ROUTES.PROFILE}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{t('profile')}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>{logoutMutation.isPending ? '...' : t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

