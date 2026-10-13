# BREW & BLOOM

A client-only cafe storefront demo built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React. The menu, cart, tax and discount settings, and order history are stored in this browser's local storage. Checkout is a clearly labelled simulated demo payment; it does not collect payment credentials or contact a payment provider.

Prices use Indian rupees (INR). Existing USD demo prices are converted once at a fixed approximate rate of ₹83 per USD; no live exchange-rate service is used.

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create and serve a production build, run `npm run build` and `npm run preview`.

## Demo features

- Search and filter the seasonal menu, customize drink size, milk, and add-ons, and manage cart quantities.
- Adjust demo tax and discount percentages in the cart before checkout.
- Submit a simulated demo order and view its itemized receipt. Print uses the browser print dialog; PDF download is generated in the browser.
- Use **Manage** to add, edit, pause, and delete menu items, and view local order history.

All customer and order data stays in local storage on this device. Clearing site storage removes the demo data. This project has no backend, database, server API, cloud service, or real payment integration.