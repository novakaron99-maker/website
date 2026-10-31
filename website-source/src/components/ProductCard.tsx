import { ArrowUpRight, Check } from 'lucide-react';
import { formatPrice, type Product } from '../data/products';

export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const file = product.art === 'private' ? 'fortnite-private' : product.art === 'slotted' ? 'fortnite-slotted' : product.art;
  return <img className={className} src={`/assets/${file}.webp`} alt={`${product.name} — official Goblin Services artwork`} loading="lazy" width="1774" height={product.art === 'colorbot' ? '998' : '887'} />;
}

export default function ProductCard({ product, onSelect, index }: { product: Product; onSelect: (product: Product) => void; index: number }) {
  return <article className={`product-card product-${product.art} reveal`} style={{ '--reveal-delay': `${(index % 3) * 75}ms` } as React.CSSProperties}>
    <button className="product-card-button" onClick={() => onSelect(product)} aria-label={`View ${product.name}, from ${formatPrice(product.licenses[0].price)}`}>
      <div className="product-art">
        <ProductImage product={product} />
        <span className="art-shade" />
        {product.badge && <span className={`product-badge ${product.art === 'slotted' ? 'badge-outline' : ''}`}><span />{product.badge}</span>}
        <span className="art-view">Explore product <ArrowUpRight size={15} /></span>
      </div>
      <div className="product-body">
        <div className="product-category">{product.categoryLabel}<span className="status-inline"><span className="status-dot" />{product.status}</span></div>
        <h3>{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>
        <div className="product-chips">{product.chips.map(chip => <span key={chip}><Check size={12} />{chip}</span>)}</div>
        <div className="product-bottom">
          <div className="product-price"><span>STARTING AT</span><strong>{formatPrice(product.licenses[0].price)}</strong><small> / license</small></div>
          <span className="product-arrow"><ArrowUpRight size={21} /></span>
        </div>
      </div>
    </button>
  </article>;
}
