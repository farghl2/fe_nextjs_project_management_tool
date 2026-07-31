import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import "../globals.css";
import ReactQueryProvider from '../../lib/providers/ReactQueryProvider';
import { Directions, Languages } from '@/src/shared/constans/enums';
import { AuthProvider } from '@/src/shared/providers/auth-context';
import { ThemeProvider } from '@/src/shared/providers/theme-provider';
import { Toaster } from '@/src/shared/components/ui/sonner';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  const isRtl = locale === Languages.ARABIC;

  return (
    <div
      lang={locale}
      dir={isRtl ? Directions.RTL : Directions.LTR}
      className="font-sans antialiased min-h-screen bg-background text-foreground"
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <AuthProvider>
              <NuqsAdapter>
                {children}
                <Toaster richColors position="top-right" closeButton />
              </NuqsAdapter>
            </AuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}
