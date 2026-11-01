import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, CheckCheck, ChevronRight, ExternalLink, Headphones, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { formatPrice, type Product } from '../data/products';
import { siteConfig } from '../config';
import { DiscordIcon } from './Brand';
import { ProductImage } from './ProductCard';

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [tab, setTab] = useState('features');
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const license = product.licenses[selectedLicense];
  const close = () => {
    if (closing) return;
    setClosing(true);
    timeoutRef.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus({ preventScroll: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <dialog ref={dialogRef} data-lenis-prevent className={`product-dialog ${closing ? 'dialog-closing' : ''}`} aria-labelledby="product-dialog-title"
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="product-dialog-inner">
      <div className="dialog-header"><span>THE COLLECTION <ChevronRight size={12} /> {product.name}</span><button className="icon-button dialog-close" onClick={close} aria-label="Close product details"><X size={21} /></button></div>
      <div className="dialog-layout">
        <div className="dialog-detail">
          <div className="dialog-art"><ProductImage product={product} /><span className="dialog-art-overlay" /><span className="status-pill"><span className="status-dot" />{product.status}</span></div>
          <div className="dialog-product-copy">
            <span className="eyebrow">{product.categoryLabel}</span>
            <h2 id="product-dialog-title">{product.name}<span>.</span></h2>
            <p>{product.description}</p>
            <div className="detail-tabs" role="tablist" aria-label="Product information">
              <button id="features-tab" role="tab" aria-selected={tab === 'features'} aria-controls="features-panel" tabIndex={tab === 'features' ? 0 : -1} className={tab === 'features' ? 'active' : ''} onClick={() => setTab('features')} onKeyDown={e => { if (product.compatibility.length && ['ArrowRight', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); setTab('compatibility'); document.getElementById('compatibility-tab')?.focus(); } }}>Features</button>
              {product.compatibility.length > 0 && <button id="compatibility-tab" role="tab" aria-selected={tab === 'compatibility'} aria-controls="compatibility-panel" tabIndex={tab === 'compatibility' ? 0 : -1} className={tab === 'compatibility' ? 'active' : ''} onClick={() => setTab('compatibility')} onKeyDown={e => { if (['ArrowRight', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); setTab('features'); document.getElementById('features-tab')?.focus(); } }}>Compatibility</button>}
            </div>
            {tab === 'features' ? <div id="features-panel" role="tabpanel" aria-labelledby="features-tab" className="detail-panel" tabIndex={0}>
              <div className="feature-list">{product.features.map((feature, index) => <div className="detail-feature" key={feature.title} style={{ '--item-index': index } as React.CSSProperties}><span><Check size={14} /></span><div><h4>{feature.title}</h4><p>{feature.description}</p></div></div>)}</div>
              {product.extraFeatures && <><h3 className="extra-features-title">{product.extraFeatures.title}</h3><div className="feature-list">{product.extraFeatures.items.map((feature, index) => <div className="detail-feature" key={feature.title} style={{ '--item-index': index } as React.CSSProperties}><span><ShieldCheck size={14} /></span><div><h4>{feature.title}</h4><p>{feature.description}</p></div></div>)}</div></>}
            </div> : <div id="compatibility-panel" role="tabpanel" aria-labelledby="compatibility-tab" className="detail-panel compatibility-panel" tabIndex={0}>
              <h3>Made for your setup.</h3><p>Supported platforms and hardware, as listed by Goblin Services.</p>
              {product.compatibility.map(item => <div className="compatibility-item" key={item}><CheckCheck size={17} />{item}</div>)}
            </div>}
          </div>
        </div>
        <aside className="license-panel">
          <div className="license-intro"><span className="eyebrow">MAKE IT YOURS</span><h3>CHOOSE YOUR LICENSE<span>.</span></h3><p>Find the right fit. Unlock your edge.</p></div>
          <fieldset className="license-options"><legend className="sr-only">Select a {product.name} license</legend>
            {product.licenses.map((option, index) => <label className={`license-option ${selectedLicense === index ? 'selected' : ''}`} key={`${option.group ?? ''}-${option.name}`} style={{ '--item-index': index } as React.CSSProperties}>
              <input type="radio" name="license" value={index} checked={selectedLicense === index} onChange={() => setSelectedLicense(index)} />
              <span className="license-radio" /><span className="license-name">{option.group && <small>{option.group}</small>}{option.name}{option.recommended && <em>RECOMMENDED</em>}</span><strong>{formatPrice(option.price)}</strong>
            </label>)}
          </fieldset>
          <div className="license-total"><span>Total <small>USD</small></span><strong key={selectedLicense}>{formatPrice(license.price)}</strong></div>
          <a className="button button-primary purchase-button" href={siteConfig.storeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Purchase ${product.name}, ${license.group ? license.group + ', ' : ''}${license.name}, for ${formatPrice(license.price)} on Sellhub`}>Purchase now <ArrowUpRight size={19} /></a>
          <div className="secure-checkout"><LockKeyhole size={12} />Continue to our secure Sellhub store<ExternalLink size={10} /></div>
          <p className="checkout-note">Select this product and license in the store to complete your purchase.</p>
          {product.art === 'slotted' && <div className="slots-note"><span className="status-dot" />Limited slots. Check availability in the store.</div>}
          <div className="license-support"><Headphones size={20} /><div><strong>Need a hand choosing?</strong><a href={siteConfig.discordUrl} target="_blank" rel="noopener noreferrer">Talk to us on Discord<DiscordIcon width="13" height="13" /></a></div></div>
        </aside>
      </div>
    </div>
  </dialog>;
}
