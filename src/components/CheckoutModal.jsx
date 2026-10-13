import { useState } from 'react'
import { ArrowLeft, LockKeyhole, X } from 'lucide-react'
import { money, calculateTotals } from '../utils/format'

export default function CheckoutModal({ items, onClose, onBack, onComplete, taxRate, discountRate }) {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', pickup: 'In 15 minutes', note: '' })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const totals = calculateTotals(items, taxRate, discountRate)

  const submit = async (event) => {
    event.preventDefault()
    setProcessing(true)
    setError('')
    await new Promise((resolve) => window.setTimeout(resolve, 850))
    const order = {
      id: `BB-${Date.now().toString().slice(-7)}`,
      createdAt: new Date().toISOString(),
      customer: { ...customer },
      items: items.map((item) => ({ ...item, customization: [...(item.customization || [])] })),
      totals: { ...totals }, taxRate: Number(taxRate), discountRate: Number(discountRate),
      paymentStatus: 'Demo payment approved',
    }
    try {
      onComplete(order)
    } catch {
      setProcessing(false)
      setError('We could not save this demo order. Please try again.')
    }
  }

  return (
    <div className="modal-scrim checkout-scrim" role="presentation">
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div className="checkout-top"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Bag</button><button className="icon-button" onClick={onClose} aria-label="Close checkout"><X size={20} /></button></div>
        <span className="eyebrow">Just a few details</span><h2 id="checkout-title">Make it a date.</h2>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="customer-name">Your name</label><input id="customer-name" className="form-control" required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
          <div className="form-grid"><div><label className="field-label" htmlFor="customer-email">Email</label><input id="customer-email" type="email" className="form-control" required autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></div><div><label className="field-label" htmlFor="customer-phone">Phone</label><input id="customer-phone" type="tel" className="form-control" required autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></div></div>
          <label className="field-label" htmlFor="pickup-time">Pickup time</label><select id="pickup-time" className="form-control" value={customer.pickup} onChange={(event) => setCustomer({ ...customer, pickup: event.target.value })}><option>In 15 minutes</option><option>In 30 minutes</option><option>In 45 minutes</option></select>
          <label className="field-label" htmlFor="order-note">A note for the barista <span className="optional">Optional</span></label><textarea id="order-note" className="form-control note-control" rows="2" value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} />
          <div className="checkout-summary"><span>Your total</span><strong>{money(totals.total)}</strong></div>
          <div className="demo-payment"><LockKeyhole size={16} /><p><strong>DEMO PAYMENT</strong><br />Simulated only. No payment credentials are requested or processed.</p></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button full-button" type="submit" disabled={processing}>{processing ? 'Simulating payment…' : `Place demo order · ${money(totals.total)}`}</button>
        </form>
      </section>
    </div>
  )
}