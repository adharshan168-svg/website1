import { ArrowUpRight, Check, Circle, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { money } from '../utils/format'

export default function MenuItemCard({ item, index, onAdd, onCustomize, selected, onToggleSelect }) {
  return (
    <motion.article className={`menu-card ${!item.available ? 'unavailable' : ''} ${selected ? 'is-selected' : ''}`} layout
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}>
      <button className="menu-image-button" onClick={() => item.available && onCustomize(item)} disabled={!item.available} aria-label={`Customize ${item.name}`}>
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.tag && <span className="product-tag">{item.tag}</span>}
        {!item.available && <span className="sold-out">Back soon</span>}
        <span className="image-arrow"><ArrowUpRight size={17} /></span>
      </button>
      <button className={`selection-toggle ${selected ? 'selected' : ''}`} onClick={() => onToggleSelect(item.id)} aria-pressed={selected} aria-label={`${selected ? 'Deselect' : 'Select'} ${item.name}`} title={`${selected ? 'Deselect' : 'Select'} ${item.name}`}>
        {selected ? <Check size={17} /> : <Circle size={17} />}
      </button>
      <div className="menu-card-copy">
        <div className="product-heading"><h3>{item.name}</h3><span>{money(item.price)}</span></div>
        <p>{item.description}</p>
        <div className="product-actions">
          <button className="customize-link" onClick={() => onCustomize(item)} disabled={!item.available}>Make it yours</button>
          <button className="add-button" onClick={() => onAdd(item)} disabled={!item.available} aria-label={`Add ${item.name} to bag`}><Plus size={17} /> Add</button>
        </div>
      </div>
    </motion.article>
  )
}