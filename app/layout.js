import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata = {
  title: { default: 'KiddyShop — Magical Shopping for Little Ones', template: '%s | KiddyShop' },
  description: 'Discover enchanting kids clothes, toys, newborn essentials & stationery. Free shipping on orders over Rs. 2000!',
  keywords: ['kids clothes', 'children toys', 'baby essentials', 'kids stationery', 'online shopping Pakistan'],
  openGraph: {
    title: 'KiddyShop — Magical Shopping for Little Ones',
    description: 'Enchanting collection of kids clothes, toys, newborn essentials & stationery.',
    type: 'website',
    locale: 'en_PK',
    siteName: 'KiddyShop',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-white text-gray-800 antialiased">
        <Navbar />
        <CartSidebar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              borderRadius: '16px',
              padding: '14px 18px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#A855F7', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
