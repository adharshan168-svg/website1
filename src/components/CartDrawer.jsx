import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { money, calculateTotals } from '../utils/format'

export default function CartDrawer({ open, items, setQuantity, removeItem, onClose, onCheckout, taxRate, discountRate, setTaxRate, setDiscountRate }) {
  if (!open) return null
  const totals = calculateTotals(items, taxRate, discountRate)
  return (
    <div className="drawer-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-header"><div><span className="eyebrow">Good things, gathered</span><h2 id="cart-title">Your little bag <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close bag"><X size={21} /></button></div>
        <div className="cart-lines">
          {!items.length ? <div className="empty-cart"><ShoppingBag size={30} strokeWidth={1.4} /><p>Your bag is taking a quiet moment.</p><button className="text-button" onClick={onClose}>Explore the menu</button></div> : items.map((item) => (
            <article className="cart-line" key={item.lineId}>
              <img src={item.image} alt="" />
              <div className="cart-line-main"><h3>{item.name}</h3><p>{item.customization?.filter(Boolean).join(' · ') || 'Made just right'}</p><div className="quantity-control"><button onClick={() => setQuantity(item.lineId, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => setQuantity(item.lineId, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={13} /></button></div></div>
              <div className="cart-line-price"><strong>{money(item.price * item.quantity)}</strong><button onClick={() => removeItem(item.lineId)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button></div>
            </article>
          ))}
        </div>
        {items.length > 0 && <div className="cart-bottom">
          <details className="totals-settings"><summary>Adjust demo totals</summary><div className="settings-fields"><label>Tax <span><input aria-label="Tax percentage" type="number" min="0" max="100" step="0.25" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} /> %</span></label><label>Discount <span><input aria-label="Discount percentage" type="number" min="0" max="100" step="1" value={discountRate} onChange={(event) => setDiscountRate(event.target.value)} /> %</span></label></div></details>
          <div className="total-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
          {totals.discount > 0 && <div className="total-row discount-row"><span>Demo discount ({discountRate}%)</span><span>−{money(totals.discount)}</span></div>}
          <div className="total-row"><span>Estimated tax ({taxRate}%)</span><span>{money(totals.tax)}</span></div>
          <div className="total-row total-final"><span>Total</span><strong>{money(totals.total)}</strong></div>
          <button className="primary-button full-button checkout-button" onClick={onCheckout}>Continue to checkout <span>→</span></button>
          <p className="demo-note">Demo checkout only. No payment details are collected.</p>
        </div>}
      </aside>
    </div>
  )
}