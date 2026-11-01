import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, AudioLines, Cpu, Headphones, Menu, Plus, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { Brand, DiscordIcon } from './components/Brand';
import Embers from './components/Embers';
import ProductCard, { ProductImage } from './components/ProductCard';
import ProductModal from './components/ProductModal';
import { products, type Product } from './data/products';
import { siteConfig } from './config';

const faqs = [
  { question: 'How do I purchase a product?', answer: 'Choose a product, explore its features, and select your preferred license. The purchase button takes you to our Sellhub store, where you can select the matching product and license and complete checkout securely.' },
  { question: 'Which product is right for me?', answer: 'Fortnite Private offers flexible customization and license options. Fortnite Slotted provides private-level features with restricted availability. ColorBot uses screen-based color targeting. Our Permanent and Temporary tools offer different approaches to hardware ID management. Compare the product details, or ask our Discord community for help choosing.' },
  { question: 'Will it work with my setup?', answer: 'Compatibility varies by product. Open a product and check its Compatibility tab when available. Our hardware ID tools support Intel and AMD processors on Windows 10 and 11; the Permanent product also lists supported Windows versions. If your exact setup is not listed, ask our support team before purchasing.' },
  { question: 'How do licenses and updates work?', answer: 'Each product has its own license options, from short-term access to lifetime plans where listed. Fortnite Private and Slotted include regular maintenance and automatic updates. You can compare every available duration and price in the product details.' },
  { question: 'Where can I get help?', answer: 'Join our Discord community for product questions, setup assistance, and support. You can also find the published status of every product in the Status section of this website.' },
];

function LoadingScreen({ ready }: { ready: boolean }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (ready) { const timeout = setTimeout(() => setVisible(false), 700); return () => clearTimeout(timeout); }
  }, [ready]);
  if (!visible) return null;
  return <div className={`loading-screen ${ready ? 'loading-complete' : ''}`} role="status" aria-live="polite">
    <div className="loader-halo" />
    <picture><source media="(prefers-reduced-motion: reduce)" srcSet="/assets/goblin-logo-still.webp" /><img className="loader-logo" src="/assets/goblin-logo.gif" alt="Goblin Services" width="150" height="150" /></picture>
    <div className="loader-brand">GOBLIN<span>SERVICES</span></div>
    <div className="loader-track"><span /></div>
    <p>YOUR NEXT LEVEL IS LOADING<span>...</span></p>
  </div>;
}

function DiscordLink({ className = '', children = 'Join Discord' }: { className?: string; children?: React.ReactNode }) {
  return <a className={`discord-button ${className}`} href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer"><DiscordIcon width="19" height="19" /><span>{children}</span><ArrowUpRight size={15} /></a>;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const visibleProducts = products.filter(product => filter === 'all' || product.category === filter);

  useEffect(() => {
    let alive = true;
    const logo = new Image(); logo.src = '/assets/goblin-logo.gif';
    const imageReady = logo.decode().catch(() => undefined);
    Promise.all([new Promise(resolve => setTimeout(resolve, 1050)), Promise.race([imageReady, new Promise(resolve => setTimeout(resolve, 2400))])]).then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll-progress', `${maxScroll ? y / maxScroll : 0}`);
      heroRef.current?.style.setProperty('--parallax', `${reduceMotion.matches ? 0 : Math.min(y * 0.17, 150)}px`);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', scroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus(); }
      if (event.key === 'Tab') {
        const links = navRef.current?.querySelectorAll<HTMLAnchorElement>('a');
        if (!links?.length) return;
        if (event.shiftKey && document.activeElement === menuButtonRef.current) { event.preventDefault(); links[links.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); menuButtonRef.current?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    const media = window.matchMedia('(min-width: 901px)');
    const onResize = () => { if (media.matches) setMenuOpen(false); };
    media.addEventListener('change', onResize);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handler); media.removeEventListener('change', onResize); };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return <div className={`app ${ready ? 'site-ready' : 'site-loading'}`}>
    <a className="skip-link" href="#products">Skip to products</a>
    <LoadingScreen ready={ready} />
    <Embers />
    <div className="scroll-progress" aria-hidden="true" />
    <header className={`site-header ${menuOpen ? 'menu-is-open' : ''}`}>
      <div className="header-inner container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className={activeSection === 'products' ? 'active' : ''} href="#products">Products</a>
          <a className={activeSection === 'why-goblin' ? 'active' : ''} href="#why-goblin">Why Goblin</a>
          <a className={activeSection === 'status' ? 'active' : ''} href="#status">Status<span className="nav-status-dot" /></a>
          <a className={activeSection === 'faq' ? 'active' : ''} href="#faq">FAQ</a>
        </nav>
        <div className="header-actions"><DiscordLink /><a className="header-shop" href={siteConfig.storeUrl} target="_blank" rel="noopener noreferrer">Visit store<ArrowUpRight size={16} /></a></div>
        <button ref={menuButtonRef} className="mobile-menu-button icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={25} /> : <Menu size={25} />}</button>
      </div>
      <div ref={navRef} id="mobile-navigation" className={`mobile-navigation ${menuOpen ? 'open' : ''}`} inert={!menuOpen}>
        <nav aria-label="Mobile navigation">{[['products', 'Products'], ['why-goblin', 'Why Goblin'], ['status', 'Product status'], ['faq', 'FAQ']].map(([id, name], index) => <a href={`#${id}`} key={id} onClick={closeMenu}><span>0{index + 1}</span>{name}<ArrowUpRight size={23} /></a>)}</nav>
        <DiscordLink className="mobile-discord" /><a className="button button-primary" href={siteConfig.storeUrl} target="_blank" rel="noopener noreferrer">Visit store<ArrowUpRight size={18} /></a>
      </div>
    </header>

    <main>
      <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true" />
        <div className="hero-content container">
          <div className="hero-copy">
            <a className="hero-eyebrow" href="#products"><span className="small-diamond" />BUILT FOR YOUR NEXT LEVEL<ArrowUpRight size={13} /></a>
            <h1 id="hero-title"><span>YOUR EDGE.</span><span className="hero-red">UNLEASHED<span className="title-period">.</span></span></h1>
            <p className="hero-description">Precision in every play. Power in your hands.<br />Premium software for those who expect more.</p>
            <div className="hero-buttons"><a className="button button-primary" href="#products">Explore products<ArrowDownRight size={19} /></a><DiscordLink className="discord-hero">Join the community</DiscordLink></div>
            <div className="hero-assurances"><span><Zap size={14} />Fast delivery</span><span><ShieldCheck size={14} />Regular updates</span><span><Headphones size={14} />Dedicated support</span></div>
          </div>
          <div className="hero-bottom"><a href="#products" className="scroll-cue"><span><ArrowDown size={14} /></span>SCROLL TO DISCOVER</a><a href="#status" className="hero-status"><span className="status-dot" />All products undetected<ArrowUpRight size={14} /></a><span className="hero-coordinate">EST. FOR THE NEXT LEVEL / 001</span></div>
        </div>
        <span className="hero-section-number" aria-hidden="true">G / 01</span>
      </section>

      <div className="benefit-strip" aria-label="Goblin Services benefits"><div className="benefit-strip-inner container"><span><span className="tiny-spark">✦</span>OPTIMIZED PERFORMANCE</span><span><span className="tiny-spark">✦</span>FLEXIBLE LICENSES</span><span><span className="tiny-spark">✦</span>REGULAR UPDATES</span><span><span className="tiny-spark">✦</span>RELIABLE SUPPORT</span></div></div>

      <section id="products" className="products-section section-space container" aria-labelledby="products-title">
        <div className="section-heading reveal"><div><span className="eyebrow"><span />01 / THE COLLECTION</span><h2 id="products-title">BUILT TO CHANGE<br />THE <span className="text-red">GAME.</span></h2></div><div className="section-heading-aside"><p>Your playstyle. Your setup. Your edge.<br />Find the tools that move you forward.</p><span className="small-section-label"><span className="small-diamond" />05 PREMIUM PRODUCTS</span></div></div>
        <div className="product-controls reveal"><div className="product-filters" role="group" aria-label="Filter products">{[['all', 'All products', '05'], ['enhancements', 'Game enhancements', '03'], ['hwid', 'HWID tools', '02']].map(([value, label, count]) => <button key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{count}</span></button>)}</div><span className="collection-note"><ShieldCheck size={13} />Quality comes standard.</span></div>
        <div className={`product-grid ${filter !== 'all' ? 'filtered-grid' : ''}`} aria-live="polite" aria-label={`${visibleProducts.length} products`}>
          {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} index={index} />)}
        </div>
        <div className="collection-footer reveal"><span>Not sure where to start?</span><a href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer">Let's find your fit on Discord<ArrowUpRight size={15} /></a></div>
      </section>

      <section id="why-goblin" className="why-section section-space" aria-labelledby="why-title"><div className="container">
        <div className="section-heading reveal"><div><span className="eyebrow"><span />02 / THE GOBLIN STANDARD</span><h2 id="why-title">GOOD ISN'T<br /><span className="text-red">GOOD ENOUGH.</span></h2></div><div className="section-heading-aside"><p>We obsess over the details.<br />So you can focus on what comes next.</p></div></div>
        <div className="value-grid">
          {[
            { icon: Zap, title: 'PERFORMANCE FIRST.', description: 'Power where it matters. Our tools are designed to keep the experience smooth and the FPS impact low.', number: '01' },
            { icon: Sparkles, title: 'ALWAYS EVOLVING.', description: 'Regular maintenance and thoughtful improvements. Software that keeps moving forward with you.', number: '02' },
            { icon: Cpu, title: 'YOUR SETUP. COVERED.', description: 'Intel or AMD. Flexible settings and hardware options to help you find the right fit for your system.', number: '03' },
            { icon: Headphones, title: 'WE HAVE YOUR BACK.', description: 'Real questions deserve real answers. Get setup assistance and dedicated support in our Discord.', number: '04' },
          ].map((item, index) => <article key={item.number} className="value-card reveal" style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}><div className="value-top"><span className="value-icon"><item.icon size={24} strokeWidth={1.5} /></span><span className="value-number">/{item.number}</span></div><h3>{item.title}</h3><p>{item.description}</p><span className="value-line" /></article>)}
        </div>
        <div className="standard-footer reveal"><span className="standard-star">✦</span><span>PREMIUM QUALITY. NO COMPROMISES.</span><span className="standard-rule" /><a href="#products">Experience the difference<ArrowUpRight size={15} /></a></div>
      </div></section>

      <section id="status" className="status-section section-space container" aria-labelledby="status-title">
        <div className="status-copy reveal"><span className="eyebrow"><span />03 / STAY IN THE KNOW</span><h2 id="status-title">FULL CLARITY.<br /><span className="text-red">ZERO GUESSWORK.</span></h2><p>Know where things stand.<br />All your product statuses, in one place.</p><div className="status-summary"><div className="status-summary-icon"><ShieldCheck size={24} /><span className="status-orbit" /></div><div><strong>All products undetected</strong><span><span className="status-dot" />5 of 5 products</span></div><AudioLines size={28} className="signal-icon" /></div><p className="status-source">Status information provided by Goblin Services.</p><a className="inline-link" href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer">Get updates on Discord<ArrowUpRight size={16} /></a></div>
        <div className="status-board reveal"><div className="status-board-header"><span><span className="status-dot" />PRODUCT STATUS</span><span>05 PRODUCTS</span></div><div className="status-table-heading"><span>PRODUCT</span><span>PUBLISHED STATUS</span><span className="sr-only">Details</span></div>
          {products.map(product => <button className="status-row" key={product.id} onClick={() => setSelectedProduct(product)} aria-label={`${product.name}: ${product.status}. View details.`}><span className="status-product"><span className={`status-thumbnail thumbnail-${product.art}`}><ProductImage product={product} /></span><span>{product.name}<small>{product.category === 'hwid' ? 'HWID TOOL' : product.categoryLabel}</small></span></span><span className="status-pill"><span className="status-dot" />{product.status}</span><ArrowUpRight className="status-row-arrow" size={16} /></button>)}
          <div className="status-board-footer"><span><ShieldCheck size={13} />Reliable products. Dedicated support.</span><span className="board-decor" aria-hidden="true">///</span></div>
        </div>
      </section>

      <section className="community-section container" aria-labelledby="community-title"><div className="community-card reveal"><div className="community-art" aria-hidden="true"><div className="community-orbit orbit-one" /><div className="community-orbit orbit-two" /><div className="community-orbit orbit-three" /><div className="community-logo"><picture><source media="(prefers-reduced-motion: reduce)" srcSet="/assets/goblin-logo-still.webp" /><img src="/assets/goblin-logo.gif" alt="" width="170" height="170" loading="lazy" /></picture></div><span className="community-float float-one"><DiscordIcon width="22" height="22" /></span><span className="community-float float-two"><Zap size={20} /></span><span className="community-mini-label">ONE COMMUNITY. EVERY EDGE.</span></div><div className="community-copy"><span className="eyebrow"><span />BETTER TOGETHER</span><h2 id="community-title">DON'T JUST PLAY.<br /><span className="text-red">BELONG.</span></h2><p>Product updates. Setup help. People who get it.<br />Your next level starts with the right community.</p><DiscordLink className="community-discord">Join our Discord</DiscordLink><span className="community-footnote">THE HOME OF GOBLIN SERVICES</span></div><span className="community-corner" aria-hidden="true">+</span></div></section>

      <section id="faq" className="faq-section section-space container" aria-labelledby="faq-title"><div className="faq-heading reveal"><span className="eyebrow"><span />04 / A LITTLE MORE CLARITY</span><h2 id="faq-title">GOOD QUESTIONS.<br /><span className="text-red">STRAIGHT ANSWERS.</span></h2><p>Still need a hand? We're here for you.</p><a className="inline-link" href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer"><DiscordIcon width="17" height="17" />Let's talk on Discord<ArrowUpRight size={15} /></a></div><div className="faq-list reveal">{faqs.map((faq, index) => <article className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={faq.question}><h3><button id={`faq-button-${index}`} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus"><Plus size={17} /></span></button></h3><div id={`faq-answer-${index}`} className="faq-answer" role="region" aria-labelledby={`faq-button-${index}`} aria-hidden={openFaq !== index} inert={openFaq !== index}><div><p>{faq.answer}</p></div></div></article>)}</div></section>

      <section className="final-cta container reveal" aria-labelledby="final-title"><span className="eyebrow"><span />MAKE YOUR NEXT MOVE</span><h2 id="final-title">THE EDGE IS <span>YOURS.</span></h2><a className="button button-primary" href="#products">Find your product<ArrowUpRight size={19} /></a><div className="cta-corner top-left" /><div className="cta-corner bottom-right" /><span className="cta-star" aria-hidden="true">✦</span></section>
    </main>

    <footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand"><Brand /><p>Premium software.<br />For your next level.</p></div><div className="footer-links"><span>EXPLORE</span><a href="#products">Products<ArrowUpRight size={12} /></a><a href="#why-goblin">Why Goblin<ArrowUpRight size={12} /></a><a href="#status">Product status<ArrowUpRight size={12} /></a></div><div className="footer-links"><span>CONNECT</span><a href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer">Discord<ArrowUpRight size={12} /></a><a href={siteConfig.storeUrl} target="_blank" rel="noopener noreferrer">Visit store<ArrowUpRight size={12} /></a><a href="#faq">FAQ & support<ArrowUpRight size={12} /></a></div><div className="footer-signoff"><span className="status-dot" /><span>YOUR EDGE.<br /><strong>UNLEASHED.</strong></span><a href="#home" className="back-to-top" aria-label="Back to top"><ArrowUp size={19} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Goblin Services. All rights reserved.</span><span>DESIGNED FOR WHAT'S NEXT.<span className="text-red">✦</span></span></div></div></footer>
    {selectedProduct && <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    <div className="mobile-store-bar"><a href="#products"><span><span className="status-dot" />Find your next edge</span><span>Explore products<ArrowRight size={15} /></span></a></div>
  </div>;
}
