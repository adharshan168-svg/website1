import { ShoppingBag, Sprout } from 'lucide-react'

export default function Navbar({ cartCount, onCart, onAdmin, view }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" onClick={() => view !== 'home' && onAdmin(false)} aria-label="Brew and Bloom home">
        <span className="brand-mark"><Sprout size={19} strokeWidth={1.6} /></span>
        <span>BREW <i>&</i> BLOOM</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#menu">The menu</a>
        <a href="#story">Our little story</a>
        <a href="#visit">Find us</a>
      </nav>
      <div className="header-actions">
        <button className={`text-button ${view === 'admin' ? 'is-active' : ''}`} onClick={() => onAdmin(view !== 'admin')}>
          {view === 'admin' ? 'Cafe' : 'Manage'}
        </button>
        <button className="icon-button bag-button" onClick={onCart} aria-label={`Open bag, ${cartCount} items`}>
          <ShoppingBag size={19} strokeWidth={1.7} /><span className="bag-label">Bag</span>
          <span className="bag-count">{cartCount}</span>
        </button>
      </div>
    </header>
  )
}