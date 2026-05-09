import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Badge, type MenuProps } from 'antd';
import { ShoppingCartOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { useCollectionStore } from '@/store/collection';
import { Logo } from './Logo';

// Header — fixed 88px white bar. Mirrors the live audit (logo left, three
// round icon buttons right). PRD §6.1.
//
// Adds a subtle shadow once the page scrolls past 8px so the header lifts
// off the content visually — common modern pattern.
export function Header() {
  const authUser = useAuthStore((s) => s.authUser);
  const cartCount = useCollectionStore((s) =>
    s.cart.reduce(
      (sum, c) => sum + Object.values(c.qtyBySize).reduce((a, b) => a + (b ?? 0), 0),
      0,
    ),
  );
  const openCart = useUIStore((s) => s.setCartDrawerOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const guestMenu: MenuProps['items'] = [
    { key: 'collection', label: <Link to="/design/collection">My Collection</Link> },
    { key: 'signup', label: <Link to="/auth/signup">Sign Up</Link> },
    { key: 'login', label: <Link to="/auth/login">Log In</Link> },
  ];

  const authedMenu: MenuProps['items'] = [
    { key: 'profile', label: <Link to="/design/addAccount">Account Profile</Link> },
    { key: 'orders', label: <Link to="/design/orders">Order History</Link> },
    { key: 'collection', label: <Link to="/design/collection">My Collection</Link> },
    { key: 'store', label: <Link to="/design/store">Store</Link> },
    { key: 'address', label: <Link to="/design/addressBook">Address Book</Link> },
    { key: 'password', label: <Link to="/design/changePassword">Change Password</Link> },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <button
          type="button"
          className="text-left w-full"
          onClick={() => useAuthStore.getState().setAuthUser(null)}
        >
          Log Out
        </button>
      ),
    },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white border-b transition-shadow duration-300 ${
        scrolled
          ? 'border-knitup-lighter/40 shadow-sm'
          : 'border-knitup-lighter/0 shadow-none'
      }`}
      style={{ height: 'var(--header-h)' }}
    >
      <div className="max-w-container mx-auto h-full flex items-center justify-between px-5">
        <Link to="/design/studio" aria-label="KnitStudio home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-3" aria-label="Account">
          <button
            type="button"
            aria-label="Notices"
            className="rounded-pill border border-knitup-lighter flex items-center justify-center transition-all hover:bg-knitup-bgSoft hover:border-knitup-gray active:scale-95"
            style={{ width: 48, height: 48 }}
          >
            <BellOutlined />
          </button>
          <Badge count={cartCount} size="small" offset={[-6, 6]}>
            <button
              type="button"
              aria-label={`Cart (${cartCount} items)`}
              onClick={() => openCart(true)}
              className="rounded-pill border border-knitup-lighter flex items-center justify-center transition-all hover:bg-knitup-bgSoft hover:border-knitup-gray active:scale-95"
              style={{ width: 48, height: 48 }}
            >
              <ShoppingCartOutlined />
            </button>
          </Badge>
          <Dropdown
            menu={{ items: authUser ? authedMenu : guestMenu }}
            placement="bottomRight"
            trigger={['click']}
          >
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-pill border border-knitup-lighter flex items-center justify-center transition-all hover:bg-knitup-bgSoft hover:border-knitup-gray active:scale-95"
              style={{ width: 48, height: 48 }}
            >
              <UserOutlined />
            </button>
          </Dropdown>
        </nav>
      </div>
    </header>
  );
}
