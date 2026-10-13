import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import MenuItemCard from '../components/MenuItemCard'
import { categories } from '../data/menu'
import { money } from '../utils/format'

export default function HomePage({ menu, onAdd, onCustomize }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const filteredMenu = useMemo(() => menu.filter((item) => item.available && (category === 'All' || item.category === category)
    && `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [menu, category, search])
  const selectedItems = menu.filter((item) => item.available && selectedIds.includes(item.id))
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const toggleSelection = (id) => setSelectedIds((current) => current.includes(id)
    ? current.filter((selectedId) => selectedId !== id)
    : [...current, id])

  const addSelectedItems = () => {
    selectedItems.forEach((item) => onAdd(item))
    setSelectedIds([])
  }

  return (
    <main>
      <section className="hero" id="home">
        <img className="hero-image" src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2200&q=90" alt="Golden morning light falling across a cafe table and a cup of coffee" />
        <div className="hero-shade" />
        <div className="hero-content"><motion.span className="hero-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>GOOD MORNINGS, GROWN SLOWLY</motion.span><motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>A little room<br /><i>to bloom.</i></motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>Thoughtful coffee, sun-warmed pastries, and a table saved just for you.</motion.p><motion.a className="hero-cta" href="#menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>Come on in <ArrowRight size={17} /></motion.a></div>
        <a className="hero-scroll" href="#story"><span>SCROLL A LITTLE</span><ArrowDown size={15} /></a>
        <div className="hero-side-note">EST. WITH CARE · OPEN EVERY DAY</div>
      </section>

      <section className="intro-strip" id="story"><div className="intro-index">01 <span> / OUR WAY</span></div><motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>We believe the best parts of a day are often the <i>small ones.</i> A familiar cup, something still warm from the oven, a moment that belongs only to you.</motion.p><span className="intro-flower">✳</span></section>

      <section className="menu-section" id="menu"><div className="section-topline"><span className="eyebrow">MADE WITH THE SEASONS</span><span className="section-number">02 — THE MENU</span></div><div className="menu-title-row"><div><h2>A good thing<br /><i>is growing.</i></h2></div><p>Small-batch, made from scratch, and best enjoyed slowly. Find your new usual.</p></div>
        <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter menu by category">{categories.map((value) => <button key={value} role="tab" aria-selected={category === value} className={category === value ? 'category-tab selected' : 'category-tab'} onClick={() => setCategory(value)}>{value}</button>)}</div><label className="search-box"><Search size={17} /><input type="search" placeholder="Find a favorite" aria-label="Search menu" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
        {filteredMenu.length ? <div className="menu-grid">{filteredMenu.map((item, index) => <MenuItemCard item={item} index={index} key={item.id} onAdd={onAdd} onCustomize={onCustomize} selected={selectedIds.includes(item.id)} onToggleSelect={toggleSelection} />)}</div> : <p className="no-results">Nothing on the counter by that name. Try another search.</p>}
        <div className="menu-footnote"><span>GOOD THINGS, MADE DAILY</span><span>PLEASE ASK US ABOUT ALLERGENS</span></div>
      </section>

      {selectedItems.length > 0 && <aside className="selection-bar" aria-label="Selected menu items" aria-live="polite">
        <div className="selection-summary"><span>{selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected</span><strong>{money(selectedTotal)}</strong></div>
        <button className="selection-clear" onClick={() => setSelectedIds([])}>Clear</button>
        <button className="primary-button selection-add" onClick={addSelectedItems}>Add {selectedItems.length} to bag <ArrowRight size={16} /></button>
        <button className="selection-close" onClick={() => setSelectedIds([])} aria-label="Clear selected menu items"><X size={15} /></button>
      </aside>}

      <section className="story-band"><div className="story-image"><img src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85" alt="A sunlit neighborhood cafe, ready for the morning" loading="lazy" /><span className="story-image-caption">A CORNER OF OUR WORLD</span></div><motion.div className="story-copy" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}><span className="eyebrow">A SLOWER SORT OF CAFE</span><h2>Rooted here.<br /><i>Open to everyone.</i></h2><p>We started with one good espresso machine, a borrowed recipe book, and a feeling that the neighborhood could use another place to exhale.</p><p>Today, every loaf is baked before the doors open, every cup gets a little extra care, and every seat is yours for as long as you need it.</p><a href="#visit" className="underlined-link">A little more about us <ArrowUpRight size={16} /></a></motion.div></section>

      <section className="visit-section" id="visit"><div className="visit-leaf">✳</div><span className="eyebrow">YOUR TABLE IS WAITING</span><h2>Come as you are.<br /><i>Leave a little lighter.</i></h2><div className="visit-details"><div><span>FIND OUR LITTLE CORNER</span><strong>18 Willow Lane<br />Portland, OR 97209</strong></div><div><span>WHEN THE DOOR IS OPEN</span><strong>Daily, 7 am — 5 pm<br />Brunch until 2 pm</strong></div><a href="#menu" className="visit-cta">Order something lovely <ArrowRight size={17} /></a></div></section>
      <footer className="site-footer"><a className="footer-brand" href="#home">BREW <i>&</i> BLOOM</a><span>Good coffee, good company, growing together.</span><span>© 2025 BREW & BLOOM</span></footer>
    </main>
  )
}