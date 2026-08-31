import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  
  return isMobile;
}

/**
 * Mendeteksi apakah browser saat ini dapat merender SVG filter berat
 * tanpa lag (hanya Safari Desktop yang menggunakan GPU Metal).
 * Chrome/Edge/Firefox merender SVG filter via CPU -> fallback ke CSS.
 */
export function useCanRenderSVGFilter() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    // Deteksi Safari asli: excludes Chrome, Edge, Firefox, CriOS, FxiOS, OPR
    const isSafari = /^((?!chrome|android|edg|crios|fxios|opr).)*safari/i.test(navigator.userAgent);

    setCanRender(!isMobile && isSafari);
  }, []);

  return canRender;
}
