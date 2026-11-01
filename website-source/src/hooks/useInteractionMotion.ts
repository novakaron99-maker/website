import { useEffect } from 'react';
import { gsap } from 'gsap';

const reactiveSelector = '.product-card, .value-card, .community-card, .status-board, .button, .discord-button, .back-to-top';
const pressSelector = '.button, .discord-button, .product-card-button, .product-filters button, .status-row, .faq-item button, .icon-button, .license-option, .back-to-top';

export default function useInteractionMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose: (() => void) | undefined;
    const initialize = () => {
      dispose?.(); dispose = undefined;
      if (preference.matches) return;

      type To = ReturnType<typeof gsap.quickTo>;
      const controls = new Map<HTMLElement, Record<string, To>>();
      const ripples = new Set<HTMLElement>();
      let pressed: HTMLElement | null = null;
      let scrollFrame = 0;

      const getControls = (element: HTMLElement) => {
        const existing = controls.get(element);
        if (existing) return existing;
        const properties: Record<string, string> = {
          '--magnet-x': '0px', '--magnet-y': '0px', '--tilt-x': '0deg', '--tilt-y': '0deg',
          '--image-x': '0px', '--image-y': '0px', '--pointer-x': '0px', '--pointer-y': '0px',
        };
        const tweens: Record<string, To> = {};
        Object.entries(properties).forEach(([name, value]) => {
          element.style.setProperty(name, value);
          tweens[name] = gsap.quickTo(element, name, { duration: name.startsWith('--pointer') ? .35 : .65, ease: 'power3.out' });
        });
        controls.set(element, tweens);
        return tweens;
      };

      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
        const element = event.target.closest<HTMLElement>(reactiveSelector);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const nx = Math.max(-1, Math.min(1, x / rect.width * 2 - 1));
        const ny = Math.max(-1, Math.min(1, y / rect.height * 2 - 1));
        const to = getControls(element);
        to['--pointer-x'](x); to['--pointer-y'](y);
        element.classList.add('is-pointer-active');
        if (element.matches('.product-card, .value-card')) {
          to['--tilt-x'](-ny * 2.5); to['--tilt-y'](nx * 3.5);
          to['--image-x'](-nx * 4); to['--image-y'](-ny * 4);
        } else if (element.matches('.button, .discord-button, .back-to-top')) {
          to['--magnet-x'](nx * 5); to['--magnet-y'](ny * 4);
        }
      };

      const pointerOut = (event: PointerEvent) => {
        if (!(event.target instanceof Element)) return;
        const element = event.target.closest<HTMLElement>(reactiveSelector);
        if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
        element.classList.remove('is-pointer-active');
        const to = controls.get(element);
        if (to) ['--magnet-x', '--magnet-y', '--tilt-x', '--tilt-y', '--image-x', '--image-y'].forEach(property => to[property](0));
      };

      const release = () => { pressed?.classList.remove('is-pressed'); pressed = null; };
      const press = (event: PointerEvent) => {
        if (event.button !== 0 || !(event.target instanceof Element)) return;
        const element = event.target.closest<HTMLElement>(pressSelector);
        if (!element || element.matches(':disabled')) return;
        release(); pressed = element; element.classList.add('is-pressed');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement('span');
        ripple.className = 'interaction-ripple'; ripple.setAttribute('aria-hidden', 'true');
        Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${event.clientX - rect.left}px`, top: `${event.clientY - rect.top}px` });
        element.appendChild(ripple); ripples.add(ripple);
        const animation = ripple.animate([
          { transform: 'translate(-50%, -50%) scale(0)', opacity: .25 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
        ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
        animation.finished.then(() => { ripple.remove(); ripples.delete(ripple); }).catch(() => {});
      };

      const updateParallax = () => {
        scrollFrame = 0;
        document.querySelectorAll<HTMLElement>('.product-card').forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight));
          element.style.setProperty('--image-scroll', `${progress * 12}px`);
        });
      };
      const scroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateParallax); };
      document.addEventListener('pointermove', pointerMove, { passive: true });
      document.addEventListener('pointerout', pointerOut, { passive: true });
      document.addEventListener('pointerdown', press, { passive: true });
      document.addEventListener('pointerup', release, { passive: true });
      document.addEventListener('pointercancel', release, { passive: true });
      window.addEventListener('blur', release);
      window.addEventListener('scroll', scroll, { passive: true });
      updateParallax();

      dispose = () => {
        release(); cancelAnimationFrame(scrollFrame);
        document.removeEventListener('pointermove', pointerMove);
        document.removeEventListener('pointerout', pointerOut);
        document.removeEventListener('pointerdown', press);
        document.removeEventListener('pointerup', release);
        document.removeEventListener('pointercancel', release);
        window.removeEventListener('blur', release);
        window.removeEventListener('scroll', scroll);
        ripples.forEach(ripple => { ripple.getAnimations().forEach(animation => animation.cancel()); ripple.remove(); });
        controls.forEach((tweens, element) => {
          Object.entries(tweens).forEach(([property, tween]) => { tween.tween.kill(); element.style.removeProperty(property); });
          element.classList.remove('is-pointer-active');
        });
        document.querySelectorAll<HTMLElement>('.product-card').forEach(element => element.style.removeProperty('--image-scroll'));
      };
    };
    initialize();
    preference.addEventListener('change', initialize);
    return () => { preference.removeEventListener('change', initialize); dispose?.(); };
  }, [ready]);
}
