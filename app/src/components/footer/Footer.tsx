import { Link, useLocation } from 'react-router-dom';

// Footer — hidden on the design wizard pages (full-bleed editor needs the space).
// PRD §4.
export function Footer() {
  const { pathname } = useLocation();
  const isEditor = pathname.startsWith('/design/') && pathname !== '/design/studio';
  if (isEditor) return null;

  return (
    <footer className="border-t border-knitup-lighter/60 mt-16 py-10 text-knitup-light text-sm">
      <div className="max-w-container mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} KnitStudio (replica).</span>
        <nav className="flex gap-6" aria-label="Legal">
          <Link to="/terms-and-conditions" className="hover:text-knitup-gray">
            Terms &amp; Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:text-knitup-gray">
            Privacy Policy
          </Link>
          <Link to="/contact-us" className="hover:text-knitup-gray">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
