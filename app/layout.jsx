import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar';
import Providers from './providers';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
        <head>
          <Analytics />
        </head>
        <body>
        <Providers>
          {session && <Navbar role={session.user?.role} name={session.user?.name} />}
          <main style={{ paddingTop: session ? '60px' : 0 }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}