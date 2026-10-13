import { useState } from 'react'
import { X } from 'lucide-react'
import { money } from '../utils/format'

const extras = [{ name: 'Extra espresso shot', price: 70.55 }, { name: 'Vanilla syrup', price: 41.5 }]

export default function CustomizeModal({ item, onClose, onAdd }) {
  const [size, setSize] = useState('Regular')
  const [milk, setMilk] = useState('Whole milk')
  const [selectedExtras, setSelectedExtras] = useState([])
  if (!item) return null
  const isDrink = ['Coffee', 'Tea'].includes(item.category)
  const additions = (size === 'Large' && isDrink ? 83 : 0) + selectedExtras.reduce((total, extra) => total + extra.price, 0)

  const toggleExtra = (extra) => setSelectedExtras((current) => current.some((value) => value.name === extra.name)
    ? current.filter((value) => value.name !== extra.name) : [...current, extra])

  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="customize-modal" role="dialog" aria-modal="true" aria-labelledby="customize-title">
        <button className="modal-close" onClick={onClose} aria-label="Close customization"><X size={20} /></button>
        <span className="eyebrow">A little extra lovely</span><h2 id="customize-title">Make it yours.</h2>
        <p className="modal-product-name">{item.name} <span>{money(item.price)}</span></p>
        {isDrink && <>
          <fieldset className="choice-group"><legend>Size</legend>{['Regular', 'Large'].map((value) => <label key={value} className="choice-option"><input type="radio" name="size" checked={size === value} onChange={() => setSize(value)} /><span>{value}{value === 'Large' && ` + ${money(83)}`}</span></label>)}</fieldset>
          <label className="field-label" htmlFor="milk-choice">Milk</label>
          <select id="milk-choice" value={milk} onChange={(event) => setMilk(event.target.value)} className="form-control"><option>Whole milk</option><option>Oat milk</option><option>Almond milk</option><option>Skip milk</option></select>
        </>}
        <fieldset className="choice-group extras-group"><legend>Little extras</legend>{extras.map((extra) => <label key={extra.name} className="check-option"><input type="checkbox" checked={selectedExtras.some((value) => value.name === extra.name)} onChange={() => toggleExtra(extra)} /><span>{extra.name}</span><span>+{money(extra.price)}</span></label>)}</fieldset>
        <button className="primary-button full-button" onClick={() => onAdd(item, { size: isDrink ? size : null, milk: isDrink ? milk : null, extras: selectedExtras }, additions)}>Add to bag · {money(item.price + additions)}</button>
      </section>
    </div>
  )
}