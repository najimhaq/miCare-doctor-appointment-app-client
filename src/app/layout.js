// frontend - app/layout.js
import { Toaster } from 'react-hot-toast';
import '../../styles/globals.css';
import { Manrope } from 'next/font/google';
import Navbar from '@/components/ui/Navbar';
import BlackFriday from '@/components/ui/BlackFriday';
import Footer from '@/components/ui/Footer';

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
      data-theme='dark'
      data-scroll-behavior='smooth'
      suppressHydrationWarning
      className={`${manrope.className} dark`}
    >
      <body className='flex min-h-screen flex-col text-white antialiased'>
        <BlackFriday />
        <Navbar />
        <main className='grow'>{children}</main>
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
      </body>
    </html>
  );
}
