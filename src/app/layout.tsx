import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Done | Enterprise Workspace Platform',
  description: 'Manage projects, team execution, and tasks seamlessly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
