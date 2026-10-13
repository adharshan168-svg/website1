import { useState } from 'react'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { orderDate, money } from '../utils/format'

const blankItem = { name: '', category: 'Coffee', price: '', description: '', image: '', tag: '', available: true }

export default function AdminPanel({ menu, setMenu, orders, onBack, onViewOrder }) {
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankItem)
  const [notice, setNotice] = useState('')
  const startEdit = (item) => { setEditingId(item.id); setForm({ ...item }) }
  const resetForm = () => { setEditingId(null); setForm(blankItem) }
  const saveItem = (event) => {
    event.preventDefault()
    const normalized = { ...form, price: Number(form.price), id: editingId || `item-${Date.now()}` }
    setMenu((current) => editingId ? current.map((item) => item.id === editingId ? normalized : item) : [...current, normalized])
    setNotice(editingId ? 'Menu item updated.' : 'New menu item added.')
    resetForm()
  }
  const deleteItem = (item) => {
    if (!window.confirm(`Delete ${item.name} from the menu?`)) return
    setMenu((current) => current.filter((entry) => entry.id !== item.id))
    setNotice('Menu item deleted.')
    if (editingId === item.id) resetForm()
  }
  const setAvailable = (id, available) => setMenu((current) => current.map((item) => item.id === id ? { ...item, available } : item))

  return (
    <main className="admin-page">
      <div className="admin-heading"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Cafe</button><span className="eyebrow">Local demo controls</span><h1>A look behind the counter.</h1><p>Menu changes and order history are saved in this browser only.</p></div>
      <div className="admin-layout">
        <section className="admin-section menu-admin"><div className="section-heading"><div><span className="eyebrow">The offerings</span><h2>Menu management <span>{menu.length}</span></h2></div><button className="secondary-button" onClick={resetForm}><Plus size={16} /> Add item</button></div>
          {notice && <p className="admin-notice" role="status">{notice}</p>}
          <div className="admin-items">{menu.map((item) => <article className="admin-item" key={item.id}><img src={item.image} alt="" /><div className="admin-item-info"><strong>{item.name}</strong><span>{item.category} · {money(item.price)}</span></div><label className="availability-toggle"><input type="checkbox" checked={item.available} onChange={(event) => setAvailable(item.id, event.target.checked)} /><span>{item.available ? 'Available' : 'Paused'}</span></label><button className="admin-icon" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`}><Pencil size={16} /></button><button className="admin-icon delete-icon" onClick={() => deleteItem(item)} aria-label={`Delete ${item.name}`}><Trash2 size={16} /></button></article>)}</div>
        </section>
        <aside className="admin-aside">
          <section className="admin-section admin-form-section"><span className="eyebrow">{editingId ? 'A thoughtful tweak' : 'Something new'}</span><h2>{editingId ? 'Edit an item' : 'Add to the menu'}</h2><form onSubmit={saveItem}>
            <label className="field-label" htmlFor="item-name">Name</label><input id="item-name" className="form-control" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <div className="form-grid"><div><label className="field-label" htmlFor="item-category">Category</label><select id="item-category" className="form-control" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{['Coffee', 'Tea', 'Bakery', 'Brunch'].map((category) => <option key={category}>{category}</option>)}</select></div><div><label className="field-label" htmlFor="item-price">Price (₹)</label><input id="item-price" type="number" min="0.01" step="0.01" className="form-control" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></div></div>
            <label className="field-label" htmlFor="item-description">Description</label><textarea id="item-description" className="form-control note-control" required rows="2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <label className="field-label" htmlFor="item-image">Image URL</label><input id="item-image" type="url" className="form-control" required value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
            <label className="field-label" htmlFor="item-tag">Small tag <span className="optional">Optional</span></label><input id="item-tag" className="form-control" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} />
            <label className="check-option form-availability"><input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} /><span>Available to order</span></label>
            <div className="admin-form-actions"><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Add menu item'}</button>{editingId && <button className="text-button" type="button" onClick={resetForm}>Cancel</button>}</div>
          </form></section>
          <section className="admin-section order-history"><div className="section-heading"><div><span className="eyebrow">This browser</span><h2>Order history <span>{orders.length}</span></h2></div></div>{orders.length ? <div className="order-list">{[...orders].reverse().map((order) => <button className="order-history-item" key={order.id} onClick={() => onViewOrder(order)}><span><strong>{order.customer.name}</strong><small>{orderDate(order.createdAt)} · {order.id}</small></span><strong>{money(order.totals.total)}</strong></button>)}</div> : <p className="muted-copy">Completed demo orders will live here.</p>}</section>
        </aside>
      </div>
    </main>
  )
}