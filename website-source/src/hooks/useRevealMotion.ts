import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function useRevealMotion(ready: boolean, collection: string) {
  const heroPlayed = useRef(false);

  useLayoutEffect(() => {
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {});
      const observers: IntersectionObserver[] = [];

      if (!heroPlayed.current) {
        heroPlayed.current = true;
        context.add(() => {
          const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
          timeline.fromTo('.header-inner > .brand, .desktop-nav > a, .header-actions > *, .mobile-menu-button',
            { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .055, clearProps: 'transform,opacity' }, .18);
          timeline.fromTo('.hero-eyebrow', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .9, clearProps: 'transform,opacity' }, .25);
          timeline.fromTo('.motion-letter', { yPercent: 110, rotationX: -65, rotationZ: 4, opacity: 0, filter: 'blur(8px)' },
            { yPercent: 0, rotationX: 0, rotationZ: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: .032, ease: 'expo.out', clearProps: 'transform,opacity,filter' }, .32);
          timeline.fromTo('.hero-description-line', { y: 25, opacity: 0, filter: 'blur(4px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: .12, clearProps: 'transform,opacity,filter' }, .8);
          timeline.fromTo('.hero-buttons > *', { y: 32, opacity: 0, scale: .94 },
            { y: 0, opacity: 1, scale: 1, duration: 1, stagger: .12, ease: 'back.out(1.15)', clearProps: 'transform,opacity' }, .98);
          timeline.fromTo('.hero-assurances > span', { y: 17, opacity: 0 },
            { y: 0, opacity: 1, duration: .85, stagger: .1, clearProps: 'transform,opacity' }, 1.15);
          timeline.fromTo('.hero-bottom > *', { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: .85, stagger: .08, clearProps: 'transform,opacity' }, 1.25);
        });
      }

      const reveal = (element: HTMLElement) => context.add(() => {
        element.classList.add('is-visible', 'is-revealing');
        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          delay: Math.min(parseFloat(element.style.getPropertyValue('--reveal-delay')) / 1000 || 0, .22),
          onComplete: () => { element.classList.remove('is-revealing'); },
        });
        timeline.to(element, { y: 0, x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.05, clearProps: 'transform,opacity,visibility,filter' }, 0);
        const words = element.querySelectorAll('.motion-word-inner');
        if (words.length) timeline.fromTo(words, { yPercent: 115, rotationX: -35, opacity: 0 },
          { yPercent: 0, rotationX: 0, opacity: 1, duration: 1.05, stagger: .055, ease: 'expo.out', clearProps: 'transform,opacity' }, .1);

        const details = element.querySelectorAll('.eyebrow, .section-heading-aside, .product-category, .product-body h3, .product-tagline, .product-chips, .product-bottom, .value-top, .value-card h3, .value-card p, .status-copy > p, .status-summary, .status-row, .community-copy > p, .community-discord, .faq-item, .footer-main > *, .final-cta > .button');
        if (details.length) timeline.fromTo(details, { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: .85, stagger: .065, clearProps: 'transform,opacity' }, .16);
        const image = element.querySelector('.product-art > img');
        if (image) timeline.fromTo(image, { scale: 1.16, yPercent: 8, filter: 'brightness(.55)' },
          { scale: 1, yPercent: 0, filter: 'brightness(.95)', duration: 1.45, ease: 'power2.out', clearProps: 'transform,filter' }, 0);
      });

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      }, { threshold: .06, rootMargin: '0px 0px -30px 0px' });
      observers.push(observer);

      context.add(() => {
        document.querySelectorAll<HTMLElement>('.reveal').forEach(element => {
          if (element.classList.contains('is-visible') && !element.classList.contains('product-card')) return;
          const sideways = element.classList.contains('status-board') ? 35 : element.classList.contains('status-copy') ? -28 : 0;
          gsap.set(element, { y: sideways ? 18 : 42, x: sideways, scale: .985, opacity: 0, filter: 'blur(4px)' });
          observer.observe(element);
        });
      });

      return () => {
        observers.forEach(observer => observer.disconnect());
        context.revert();
        document.querySelectorAll('.is-revealing').forEach(element => element.classList.remove('is-revealing'));
      };
    });
    return () => media.revert();
  }, [ready, collection]);
}
