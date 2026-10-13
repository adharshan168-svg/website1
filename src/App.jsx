import { useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import CustomizeModal from './components/CustomizeModal'
import CheckoutModal from './components/CheckoutModal'
import Receipt from './components/Receipt'
import AdminPanel from './components/AdminPanel'
import HomePage from './pages/HomePage'
import { initialMenu } from './data/menu'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [menu, setMenu] = useLocalStorage('brew-bloom-menu-v2', initialMenu)
  const [cart, setCart] = useLocalStorage('brew-bloom-cart-v2', [])
  const [orders, setOrders] = useLocalStorage('brew-bloom-orders-v2', [])
  const [taxRate, setTaxRate] = useLocalStorage('brew-bloom-tax-v1', 8.25)
  const [discountRate, setDiscountRate] = useLocalStorage('brew-bloom-discount-v1', 0)
  const [view, setView] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customizing, setCustomizing] = useState(null)
  const [activeOrder, setActiveOrder] = useState(null)
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  const addToCart = (item, options = null, additions = 0) => {
    const details = options ? [options.size, options.milk, ...options.extras.map((extra) => extra.name)].filter(Boolean) : []
    const price = item.price + additions
    const signature = `${item.id}-${details.join('-') || 'original'}`.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const lineId = signature
    setCart((current) => {
      const existing = current.find((line) => line.lineId === lineId)
      return existing ? current.map((line) => line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { lineId, id: item.id, name: item.name, image: item.image, price, quantity: 1, customization: details }]
    })
    setCustomizing(null)
    setCartOpen(true)
  }
  const setQuantity = (lineId, quantity) => setCart((current) => quantity < 1 ? current.filter((item) => item.lineId !== lineId) : current.map((item) => item.lineId === lineId ? { ...item, quantity } : item))
  const completeOrder = (order) => {
    setOrders((current) => [...current, order])
    setCart([])
    setCheckoutOpen(false)
    setCartOpen(false)
    setActiveOrder(order)
    setView('receipt')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const showOrder = (order) => { setActiveOrder(order); setView('receipt'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const showHome = () => { setView('home'); setActiveOrder(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <Navbar cartCount={cartCount} onCart={() => setCartOpen(true)} onAdmin={(open) => { setView(open ? 'admin' : 'home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} view={view} />
        {view === 'home' && <HomePage menu={menu} onAdd={(item) => addToCart(item)} onCustomize={setCustomizing} />}
        {view === 'admin' && <AdminPanel menu={menu} setMenu={setMenu} orders={orders} onBack={showHome} onViewOrder={showOrder} />}
        {view === 'receipt' && <Receipt order={activeOrder} onBack={showHome} />}
        <CartDrawer open={cartOpen} items={cart} setQuantity={setQuantity} removeItem={(lineId) => setCart((current) => current.filter((item) => item.lineId !== lineId))} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} taxRate={taxRate} discountRate={discountRate} setTaxRate={setTaxRate} setDiscountRate={setDiscountRate} />
        <AnimatePresence>{customizing && <CustomizeModal key="customize" item={customizing} onClose={() => setCustomizing(null)} onAdd={addToCart} />}</AnimatePresence>
        {checkoutOpen && <CheckoutModal items={cart} onClose={() => setCheckoutOpen(false)} onBack={() => { setCheckoutOpen(false); setCartOpen(true) }} onComplete={completeOrder} taxRate={taxRate} discountRate={discountRate} />}
      </div>
    </MotionConfig>
  )
}