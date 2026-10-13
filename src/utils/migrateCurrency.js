const INR_PER_USD = 83

const convertPrice = (amount) => Math.round(Number(amount) * INR_PER_USD * 100) / 100

const convertItems = (items) => items.map((item) => ({ ...item, price: convertPrice(item.price) }))

const convertOrder = (order) => ({
  ...order,
  items: convertItems(order.items),
  totals: Object.fromEntries(
    Object.entries(order.totals).map(([key, amount]) => [key, convertPrice(amount)]),
  ),
})

const migrations = [
  ['brew-bloom-menu-v1', 'brew-bloom-menu-v2', convertItems],
  ['brew-bloom-cart-v1', 'brew-bloom-cart-v2', convertItems],
  ['brew-bloom-orders-v1', 'brew-bloom-orders-v2', (orders) => orders.map(convertOrder)],
]

export function migrateLegacyCurrency() {
  for (const [legacyKey, currentKey, convert] of migrations) {
    try {
      if (localStorage.getItem(currentKey)) continue
      const legacyData = localStorage.getItem(legacyKey)
      if (legacyData) localStorage.setItem(currentKey, JSON.stringify(convert(JSON.parse(legacyData))))
    } catch {
      // Keep the app usable if browser storage is unavailable or contains invalid data.
    }
  }
}