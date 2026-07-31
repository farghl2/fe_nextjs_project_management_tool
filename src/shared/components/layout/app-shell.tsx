'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar (Full Height 100vh Sticky) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex shrink-0 sticky top-0 h-screen"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0 min-h-screen">
        <Navbar />
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
