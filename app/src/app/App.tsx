import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

// Top-level shell for every route. Header is fixed (88px), Footer renders on
// marketing-style pages. Editor pages render full-bleed beneath the header.
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-header">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
