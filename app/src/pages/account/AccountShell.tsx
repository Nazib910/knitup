import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

// Shared shell for all account pages. Sidebar nav + main content slot.
// PRD §17 Q3 resolution: pages are visual-only in v0; submitting forms
// persists to localStorage via accountStore.

const NAV = [
  { key: 'profile', label: 'Account Profile', to: '/design/addAccount' },
  { key: 'orders', label: 'Order History', to: '/design/orders' },
  { key: 'collection', label: 'My Collection', to: '/design/collection' },
  { key: 'store', label: 'Store', to: '/design/store' },
  { key: 'address', label: 'Address Book', to: '/design/addressBook' },
  { key: 'password', label: 'Change Password', to: '/design/changePassword' },
] as const;

export type AccountKey = (typeof NAV)[number]['key'];

export function AccountShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: AccountKey;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-container mx-auto px-5 py-6 lg:py-8 grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3" aria-label="Account navigation">
        <h2 className="text-h3 text-knitup-gray font-semibold mb-4">My Account</h2>
        <ul className="space-y-1">
          {NAV.map((n) => (
            <li key={n.key}>
              <NavLink
                to={n.to}
                className={classNames(
                  'block py-1 transition-colors duration-fast text-sm',
                  active === n.key
                    ? 'text-knitup-gray font-semibold'
                    : 'text-knitup-light hover:text-knitup-gray',
                )}
              >
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <section className="col-span-12 md:col-span-9">
        <h1 className="text-h2 font-display text-knitup-gray mb-2">{title}</h1>
        {subtitle && <p className="text-knitup-light mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </section>
    </div>
  );
}
