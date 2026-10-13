import { useRef } from 'react'
import { ArrowLeft, Download, Printer, Sprout } from 'lucide-react'
import { money, orderDate } from '../utils/format'

export default function Receipt({ order, onBack }) {
  const receiptRef = useRef(null)
  if (!order) return null

  const downloadPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'mm', format: 'a5' })
    const left = 18
    let y = 20
    pdf.setTextColor(43, 29, 23)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(17)
    pdf.text('BREW & BLOOM', left, y)
    y += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text('A little room to bloom', left, y)
    y += 11
    pdf.setFontSize(10)
    pdf.text(`Receipt ${order.id}`, left, y)
    y += 6
    pdf.text(orderDate(order.createdAt), left, y)
    y += 6
    pdf.text(`For ${order.customer.name}`, left, y)
    y += 10
    pdf.line(left, y, 130, y)
    y += 8
    order.items.forEach((item) => {
      const options = item.customization?.filter(Boolean).join(', ')
      const nameLines = pdf.splitTextToSize(`${item.quantity} x ${item.name}${options ? ` (${options})` : ''}`, 78)
      pdf.text(nameLines, left, y)
      pdf.text(money(item.price * item.quantity), 130, y, { align: 'right' })
      y += nameLines.length * 5 + 3
    })
    y += 2
    pdf.line(left, y, 130, y)
    y += 7
    const rows = [['Subtotal', order.totals.subtotal], ['Discount', -order.totals.discount], ['Tax', order.totals.tax], ['TOTAL', order.totals.total]]
    rows.forEach(([label, amount], index) => {
      if (!amount && label === 'Discount') return
      pdf.setFont('helvetica', index === 3 ? 'bold' : 'normal')
      pdf.text(label, left, y)
      pdf.text(`${amount < 0 ? '−' : ''}${money(Math.abs(amount))}`, 130, y, { align: 'right' })
      y += 6
    })
    y += 4
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text('DEMO PAYMENT · No real payment was taken', left, y)
    pdf.save(`brew-and-bloom-${order.id}.pdf`)
  }

  return (
    <main className="receipt-page">
      <div className="receipt-actions"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back to cafe</button><div><button className="secondary-button" onClick={() => window.print()}><Printer size={16} /> Print bill</button><button className="secondary-button" onClick={downloadPdf}><Download size={16} /> Download PDF</button></div></div>
      <article className="receipt-paper" id="print-receipt" ref={receiptRef}>
        <div className="receipt-brand"><Sprout size={22} /><span>BREW <i>&</i> BLOOM</span></div>
        <p className="receipt-welcome">A little room to bloom</p>
        <div className="receipt-rule" />
        <div className="receipt-meta"><div><span>RECEIPT</span><strong>{order.id}</strong></div><div><span>DATE</span><strong>{orderDate(order.createdAt)}</strong></div></div>
        <div className="receipt-meta"><div><span>GUEST</span><strong>{order.customer.name}</strong></div><div><span>PICKUP</span><strong>{order.customer.pickup}</strong></div></div>
        <div className="receipt-rule" />
        <div className="receipt-table-head"><span>YOUR ORDER</span><span>AMOUNT</span></div>
        {order.items.map((item, index) => <div className="receipt-item" key={`${item.lineId}-${index}`}><div><strong>{item.quantity} × {item.name}</strong>{item.customization?.filter(Boolean).map((detail) => <span key={detail}>{detail}</span>)}</div><strong>{money(item.price * item.quantity)}</strong></div>)}
        {order.customer.note && <p className="receipt-note">Barista note: {order.customer.note}</p>}
        <div className="receipt-rule" />
        <div className="receipt-total-row"><span>Subtotal</span><span>{money(order.totals.subtotal)}</span></div>
        {order.totals.discount > 0 && <div className="receipt-total-row"><span>Demo discount ({order.discountRate}%)</span><span>−{money(order.totals.discount)}</span></div>}
        <div className="receipt-total-row"><span>Tax ({order.taxRate}%)</span><span>{money(order.totals.tax)}</span></div>
        <div className="receipt-total-row receipt-grand-total"><strong>Total</strong><strong>{money(order.totals.total)}</strong></div>
        <div className="receipt-payment"><span>PAYMENT STATUS</span><strong>DEMO PAYMENT · APPROVED</strong><p>This is a simulated frontend order. No payment was taken.</p></div>
        <p className="receipt-thanks">Thank you for making a little room for us.</p>
      </article>
    </main>
  )
}