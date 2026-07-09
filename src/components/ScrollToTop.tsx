import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top on every route change. React Router's component
 * router keeps the previous scroll position across client-side navigations,
 * so without this you land partway down a freshly-opened page. Keyed on
 * pathname only, so in-page anchor/hash links are left alone.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
