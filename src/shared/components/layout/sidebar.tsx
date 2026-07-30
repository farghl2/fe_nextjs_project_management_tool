'use client';

import React from 'react';
import { usePathname, Link } from '@/src/i18n/routing';
import { useAuth } from '@/src/shared/providers/auth-context';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  LogOut,
  Kanban,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/shared/components/ui/button';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Badge } from '@/src/shared/components/ui/badge';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onNavigateMobile?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  className,
  onNavigateMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const t = useTranslations('navigation');

  const mainNavItems = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'MEMBER'],
    },
    {
      title: t('projects'),
      href: '/projects',
      icon: FolderKanban,
      roles: ['ADMIN', 'MEMBER'],
    },
    {
      title: t('tasks'),
      href: '/tasks',
      icon: ListTodo,
      roles: ['ADMIN', 'MEMBER'],
    },
    {
      title: t('users'),
      href: '/users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const filteredNavItems = mainNavItems.filter((item) =>
    role ? item.roles.includes(role) : true
  );

  return (
    <aside
      className={cn(
        'relative flex flex-col justify-between border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none h-screen sticky top-0',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border/60 shrink-0">
        <Link
          href="/dashboard"
          onClick={onNavigateMobile}
          className="flex items-center gap-3 font-semibold overflow-hidden"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <Kanban className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-sidebar-foreground leading-none">
                Done
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                Workspace
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 rounded-lg text-muted-foreground hover:text-sidebar-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            )}
          </Button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!isCollapsed && (
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Menu
          </p>
        )}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigateMobile}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isCollapsed && 'justify-center px-0'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User & Footer Actions */}
      <div className="p-3 border-t border-sidebar-border/60 space-y-2 shrink-0">
        {user && !isCollapsed && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/40">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <UserAvatar name={user.name} sizeClassName="h-8 w-8" />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-sidebar-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            {role && (
              <Badge variant="outline" className="text-[10px] uppercase font-mono py-0 px-1.5 shrink-0 bg-primary/10 text-primary border-primary/20">
                {role}
              </Badge>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => {
            logout();
            if (onNavigateMobile) onNavigateMobile();
          }}
          className={cn(
            'w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10',
            isCollapsed && 'justify-center px-0'
          )}
          title={isCollapsed ? t('logout') : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>{t('logout')}</span>}
        </Button>
      </div>
    </aside>
  );
}
