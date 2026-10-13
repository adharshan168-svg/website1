export const money = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR',
}).format(amount)

export const orderDate = (value) => new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value))

export const calculateTotals = (items, taxRate, discountRate) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * Math.min(Math.max(Number(discountRate) || 0, 0), 100) / 100
  const taxable = Math.max(0, subtotal - discount)
  const tax = taxable * Math.min(Math.max(Number(taxRate) || 0, 0), 100) / 100
  return { subtotal, discount, tax, total: taxable + tax }
}