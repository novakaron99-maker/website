import type { SVGProps } from 'react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#home" aria-label="Goblin Services home">
    <picture><source media="(prefers-reduced-motion: reduce)" srcSet="/assets/goblin-logo-still.webp" /><img className="brand-mark" src="/assets/goblin-logo.gif" alt="" width="43" height="43" /></picture>
    <span className="brand-type">GOBLIN<span>SERVICES<span className="brand-period">®</span></span></span>
  </a>;
}

export function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.51c-.21.38-.45.89-.62 1.29a18.4 18.4 0 0 0-5.42 0 13.5 13.5 0 0 0-.62-1.29 19.7 19.7 0 0 0-4.9 1.52C.78 8.94-.06 13.38.36 17.76a19.7 19.7 0 0 0 6 3.04c.48-.66.9-1.36 1.27-2.1a12.8 12.8 0 0 1-2-1 13 13 0 0 0 .5-.4 14.1 14.1 0 0 0 11.74 0l.5.4c-.63.39-1.3.72-2 1 .36.74.79 1.44 1.27 2.1a19.6 19.6 0 0 0 6-3.04c.5-5.08-.85-9.48-3.32-13.39ZM8.02 15.1c-1.17 0-2.13-1.08-2.13-2.4s.94-2.42 2.13-2.42c1.2 0 2.15 1.1 2.13 2.42 0 1.32-.94 2.4-2.13 2.4Zm7.96 0c-1.17 0-2.13-1.08-2.13-2.4s.94-2.42 2.13-2.42c1.2 0 2.15 1.1 2.13 2.42 0 1.32-.94 2.4-2.13 2.4Z" />
  </svg>;
}
