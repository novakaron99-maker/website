import { useEffect } from 'react';
import Lenis from 'lenis';

/** Smooth wheel/anchor scrolling; touch scrolling stays native and dialogs stay independent. */
export default function useSmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose: (() => void) | undefined;
    const initialize = () => {
      dispose?.();
      dispose = undefined;
      if (preference.matches) return;

      const lenis = new Lenis({
        autoRaf: true,
        duration: 1.15,
        easing: t => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        syncTouch: false,
        prevent: element => Boolean(element.closest('dialog, [data-lenis-prevent]')),
      });
      let anchorFrame = 0;
      const syncLock = () => {
        if (document.body.style.overflow === 'hidden') lenis.stop();
        else lenis.start();
      };
      const lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      syncLock();

      const onAnchor = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        if (window.location.hash !== hash) history.pushState(null, '', hash);
        // Let the mobile menu release its scroll lock before starting an anchor transition.
        cancelAnimationFrame(anchorFrame);
        anchorFrame = requestAnimationFrame(() => {
          if (document.body.style.overflow === 'hidden') return;
          lenis.start();
          lenis.scrollTo(target, {
            offset: target.id === 'home' ? 0 : -28,
            duration: 1.35,
            onComplete: () => {
              if (link.classList.contains('skip-link')) {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
              }
            },
          });
        });
      };
      document.addEventListener('click', onAnchor);
      dispose = () => {
        cancelAnimationFrame(anchorFrame);
        document.removeEventListener('click', onAnchor);
        lockObserver.disconnect();
        lenis.destroy();
      };
    };
    initialize();
    preference.addEventListener('change', initialize);
    return () => { preference.removeEventListener('change', initialize); dispose?.(); };
  }, []);
}
