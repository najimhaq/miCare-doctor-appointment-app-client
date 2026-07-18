// frontend - app/layout.js
import { Toaster } from 'react-hot-toast';
import '../../styles/globals.css';
import { Manrope } from 'next/font/google';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SmoothScrollProvider from '@/components/lenis/SmoothScroll';
import ScrollReset from '@/components/lenis/ScrollReset';
import ScrollProgress from '@/components/lenis/ScrollProgress';
import BackToTop from '@/components/lenis/BackToTop';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Medicare - Find Your Perfect Doctor',
  description: 'Discover and book amazing doctors worldwide',
};

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      data-scroll-behavior='smooth'
      suppressHydrationWarning
      className={manrope.className}
    >
      <body className='flex min-h-screen flex-col  antialiased'>
        <AuthProvider>
          <SmoothScrollProvider>
            <ScrollReset />

            <Navbar />
            <ScrollProgress />
            <main className='grow'>
              <div className='mx-auto max-w-full'>{children}</div>
            </main>
            <BackToTop />
            <Footer />
            <Toaster
              position='top-right'
              toastOptions={{
                style: {
                  background: '#171717',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
