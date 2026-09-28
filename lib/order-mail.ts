import { sendMail } from './mailer'
import { escapeHtml } from './validation'
import { renderLayout, emailTextFooter } from './email-layout'
import { PICKUP_TIME_ZONE } from './pickup-slots'

export interface MailItem {
  name: string
  quantity: number
  unit: string
  price: number
}

export function formatMoney(value: number): string {
  return `${value.toFixed(2)} EUR`
}

export function formatPickupLabel(value: string | Date): string {
  return new Intl.DateTimeFormat('sl-SI', {
    timeZone: PICKUP_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function itemsTable(items: MailItem[]): string {
  const rows = items
    .map((item) => {
      const line = item.price * item.quantity
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;">${escapeHtml(item.name)}</td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#4b5563;white-space:nowrap;">${item.quantity} ${escapeHtml(item.unit)}</td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600;white-space:nowrap;">${formatMoney(line)}</td>
      </tr>`
    })
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <thead>
      <tr>
        <th align="left" style="padding:6px 0;font-size:12px;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #d1d5db;">Izdelek</th>
        <th align="right" style="padding:6px 0;font-size:12px;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #d1d5db;">Količina</th>
        <th align="right" style="padding:6px 0;font-size:12px;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #d1d5db;">Cena</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`
}

function summaryRow(label: string, value: string, bold = false): string {
  const style = `padding:8px 0;${bold ? 'font-weight:700;color:#16a34a;' : 'color:#111827;'}`
  return `<tr><td style="padding:8px 0;color:#6b7280;">${escapeHtml(label)}</td><td align="right" style="${style}">${value}</td></tr>`
}

function pickupBlock(pickupLabel: string, extraLines: string[] = []): string {
  const extras = extraLines
    .map((l) => `<p style="margin:4px 0 0 0;color:#374151;">${l}</p>`)
    .join('')
  return `<div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
    <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;color:#15803d;letter-spacing:0.04em;">Prevzem</p>
    <p style="margin:0;color:#14532d;font-weight:600;line-height:1.4;">${escapeHtml(pickupLabel)}</p>
    ${extras}
  </div>`
}

function ctaButton(url: string, label: string): string {
  return `<div style="margin:24px 0;text-align:center;">
    <a href="${escapeHtml(url)}" style="background-color:#16a34a;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">${escapeHtml(label)}</a>
  </div>`
}

interface OrderCreatedNotify {
  to: string
  orderShort: string
  farmName: string
  items: MailItem[]
  subtotal: number
  pickupLabel: string
  payUrl: string
  dashboardUrl: string
}

export async function notifyOrderCreated(opts: OrderCreatedNotify) {
  const total = opts.subtotal
  const text =
    `Pozdravljeni!\n\n` +
    `Vaše naročilo #${opts.orderShort} pri kmetiji ${opts.farmName} je oddano in čaka na plačilo.\n\n` +
    `Znesek: ${formatMoney(total)}\n` +
    `Termin prevzema: ${opts.pickupLabel}\n\n` +
    `Dokončajte plačilo na: ${opts.payUrl}\n` +
    `Pregled naročil: ${opts.dashboardUrl}` +
    emailTextFooter

  const html = renderLayout({
    title: `Naročilo #${opts.orderShort} je oddano`,
    preheader: `Naročilo #${opts.orderShort} pri kmetiji ${opts.farmName} — čaka na plačilo.`,
    bodyHtml: `
      <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">Hvala za vaše naročilo!</h2>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">
        Vaše naročilo <strong>#${escapeHtml(opts.orderShort)}</strong> pri kmetiji
        <strong>${escapeHtml(opts.farmName)}</strong> je oddano. Do oddaje čaka na plačilo.
      </p>
      ${itemsTable(opts.items)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0 0;">
        ${summaryRow('Skupaj za plačilo', formatMoney(total), true)}
      </table>
      ${pickupBlock(opts.pickupLabel)}
      ${ctaButton(opts.payUrl, 'Dokončaj plačilo')}
      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
        Vaše naročilo oz. sporočilo o plačilu boste prejeli tudi po e-pošti.
      </p>
    `,
  })

  await sendMail({
    to: opts.to,
    subject: `Naročilo #${opts.orderShort} je oddano`,
    text,
    html,
  })
}

interface PaymentConfirmedNotify {
  to: string
  orderShort: string
  farmName: string
  items: MailItem[]
  total: number
  paymentRef: string
  pickupLabel: string
  farmPhone?: string | null
  dashboardUrl: string
}

export async function notifyPaymentConfirmed(opts: PaymentConfirmedNotify) {
  const text =
    `Pozdravljeni!\n\n` +
    `Plačilo naročila #${opts.orderShort} pri kmetiji ${opts.farmName} je uspešno potrjeno.\n\n` +
    `Znesek: ${formatMoney(opts.total)}\n` +
    `Sklic: ${opts.paymentRef}\n` +
    `Termin prevzema: ${opts.pickupLabel}\n${opts.farmPhone ? `Telefon kmetije: ${opts.farmPhone}\n` : ''}` +
    `\nPregled naročil: ${opts.dashboardUrl}` +
    emailTextFooter

  const html = renderLayout({
    title: `Plačilo potrjeno — naročilo #${opts.orderShort}`,
    preheader: `Plačilo naročila #${opts.orderShort} je potrjeno. Termin prevzema: ${opts.pickupLabel}.`,
    bodyHtml: `
      <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">✓ Plačilo uspešno</h2>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">
        Plačilo za naročilo <strong>#${escapeHtml(opts.orderShort)}</strong> pri kmetiji
        <strong>${escapeHtml(opts.farmName)}</strong> je potrjeno. Kmetija je obveščena in bo pripravila
        izdelke za prevzem.
      </p>
      ${itemsTable(opts.items)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0 0;">
        ${summaryRow('Plačano', formatMoney(opts.total), true)}
        ${summaryRow('Sklic / PLAČILO', opts.paymentRef)}
      </table>
      ${pickupBlock(opts.pickupLabel, opts.farmPhone ? [`Telefon kmetije: ${escapeHtml(opts.farmPhone)}`] : [])}
      ${ctaButton(opts.dashboardUrl, 'Moja naročila')}
    `,
  })

  await sendMail({
    to: opts.to,
    subject: `Plačilo potrjeno — naročilo #${opts.orderShort}`,
    text,
    html,
  })
}

interface NewOrderToFarmerNotify {
  to: string
  orderShort: string
  farmName: string
  buyerLabel: string
  items: MailItem[]
  total: number
  pickupLabel: string
  buyerPhone: string
  notes?: string | null
  dashboardUrl: string
}

export async function notifyNewOrderToFarmer(opts: NewOrderToFarmerNotify) {
  const text =
    `Pozdravljeni!\n\n` +
    `Prejeli ste novo, plačano naročilo #${opts.orderShort}.\n\n` +
    `Kupec: ${opts.buyerLabel}\n` +
    `Telefon: ${opts.buyerPhone}\n` +
    `Znesek: ${formatMoney(opts.total)}\n` +
    `Termin prevzema: ${opts.pickupLabel}\n` +
    `${opts.notes ? `Opombe: ${opts.notes}\n` : ''}` +
    `\nOddajte naročilo v nadzorni plošči: ${opts.dashboardUrl}` +
    emailTextFooter

  const html = renderLayout({
    title: `Novo naročilo #${opts.orderShort}`,
    preheader: `Kmetija ${opts.farmName} — novo plačano naročilo #${opts.orderShort}, prevzem ${opts.pickupLabel}.`,
    bodyHtml: `
      <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">Novo plačano naročilo 🎉</h2>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">
        Prejeli ste novo, že <strong>plačano</strong> naročilo
        <strong>#${escapeHtml(opts.orderShort)}</strong>. Pripravite izdelke in spremljajte prevzem.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
        ${summaryRow('Kupec', escapeHtml(opts.buyerLabel))}
        ${summaryRow('Telefon', escapeHtml(opts.buyerPhone))}
        ${opts.notes ? summaryRow('Opombe', escapeHtml(opts.notes)) : ''}
      </table>
      ${itemsTable(opts.items)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0 0;">
        ${summaryRow('Skupaj', formatMoney(opts.total), true)}
      </table>
      ${pickupBlock(opts.pickupLabel)}
      ${ctaButton(opts.dashboardUrl, 'Preglej naročila')}
    `,
  })

  await sendMail({
    to: opts.to,
    subject: `Novo naročilo #${opts.orderShort}`,
    text,
    html,
  })
}