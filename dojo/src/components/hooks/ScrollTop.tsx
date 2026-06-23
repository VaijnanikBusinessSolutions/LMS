import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Disable browser's default scroll memory
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Use requestAnimationFrame to ensure the page has rendered
    requestAnimationFrame(() => {
      // Scroll the window
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // 3. TARGET THE MAIN CONTENT DIV 
      // Most Django/React layouts use a 'main' tag or a div with id 'root'
      const mainContent = document.querySelector('main') || document.getElementById('root');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;