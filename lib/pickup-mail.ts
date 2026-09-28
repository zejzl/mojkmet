import { sendMail } from './mailer'
import { escapeHtml } from './validation'
import { renderLayout, emailTextFooter } from './email-layout'

interface ProposalNotify {
  to: string
  orderShort: string
  farmName: string
  proposerLabel: string
  proposed: string // pre-formatted "petek, 2. oktobra ob 17:00"
  reason?: string
  dashboardUrl: string
  responseHint: string
}

export async function notifyNewPickupProposal(opts: ProposalNotify) {
  const reasonText = opts.reason ? `\nRazlog: ${opts.reason}` : ''
  const text =
    `Pozdravljeni,\n\n` +
    `${opts.proposerLabel} je poslal(a) predlog spremembe termina prevzema za naročilo #${opts.orderShort} (${opts.farmName}).\n\n` +
    `Predlagan termin: ${opts.proposed}${reasonText}\n\n` +
    `${opts.responseHint}\n\n${opts.dashboardUrl}` +
    emailTextFooter
  const html = renderLayout({
    title: `Prevzem #${opts.orderShort} — predlog novega termina`,
    preheader: `${opts.proposerLabel} predlaga nov termin prevzema za #${opts.orderShort}: ${opts.proposed}.`,
    bodyHtml: `
      <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">Predlog novega termina prevzema</h2>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">
        <strong>${escapeHtml(opts.proposerLabel)}</strong> je poslal(a) predlog spremembe
        termina prevzema za naročilo <strong>#${escapeHtml(opts.orderShort)}</strong>
        (${escapeHtml(opts.farmName)}).
      </p>
      <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:0 0 16px 0;">
        <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;color:#15803d;letter-spacing:0.04em;">Predlagan termin</p>
        <p style="margin:0;color:#14532d;font-weight:600;">${escapeHtml(opts.proposed)}</p>
        ${opts.reason ? `<p style="margin:8px 0 0 0;color:#374151;">Razlog: ${escapeHtml(opts.reason)}</p>` : ''}
      </div>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">${escapeHtml(opts.responseHint)}</p>
      <div style="margin:20px 0;text-align:center;">
        <a href="${escapeHtml(opts.dashboardUrl)}" style="background-color:#16a34a;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">Odpri nadzorno ploščo</a>
      </div>
    `,
  })
  await sendMail({
    to: opts.to,
    subject: `Prevzem #${opts.orderShort} — predlog novega termina`,
    text,
    html,
  })
}

interface ResolvedNotify {
  to: string
  orderShort: string
  farmName: string
  action: 'ACCEPT' | 'REJECT' | 'CANCEL'
  proposed: string
  dashboardUrl: string
}

export async function notifyPickupChangeResolved(opts: ResolvedNotify) {
  const sl: Record<ResolvedNotify['action'], string> = {
    ACCEPT: 'je SPREJEL(a) vaš predlog novega termina prevzema',
    REJECT: 'je ZAVRNIL(a) vaš predlog novega termina prevzema',
    CANCEL: 'je PREKLICIL(a) vaš predlog novega termina prevzema',
  }
  const slSubject: Record<ResolvedNotify['action'], string> = {
    ACCEPT: 'predlog sprejet',
    REJECT: 'predlog zavrnjen',
    CANCEL: 'predlog preklican',
  }
  const headline: Record<ResolvedNotify['action'], string> = {
    ACCEPT: '✓ Predlog sprejet',
    REJECT: 'Predlog zavrnjen',
    CANCEL: 'Predlog preklican',
  }
  const followUp =
    opts.action === 'ACCEPT'
      ? 'Hvala za uskladitev.'
      : 'Če je prišlo do napake, se lahko dogovorite za nov termin.'
  const text =
    `Pozdravljeni,\n\n` +
    `Vaš predlog za naročilo #${opts.orderShort} (${opts.farmName}) ${sl[opts.action]}.\n\n` +
    `Dogovorjen predlagan termin: ${opts.proposed}\n\n` +
    `${followUp}\n\n${opts.dashboardUrl}` +
    emailTextFooter
  const html = renderLayout({
    title: `Prevzem #${opts.orderShort} — ${slSubject[opts.action]}`,
    preheader: `Vaš predlog termina za #${opts.orderShort} ${sl[opts.action].toLowerCase()}.`,
    bodyHtml: `
      <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">${headline[opts.action]}</h2>
      <p style="margin:0 0 12px 0;color:#374151;line-height:1.6;">
        Vaš predlog za naročilo <strong>#${escapeHtml(opts.orderShort)}</strong> (${escapeHtml(opts.farmName)})
        ${sl[opts.action]}.
      </p>
      <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:0 0 12px 0;">
        <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;color:#15803d;letter-spacing:0.04em;">Termin</p>
        <p style="margin:0;color:#14532d;font-weight:600;">${escapeHtml(opts.proposed)}</p>
      </div>
      <p style="margin:0 0 16px 0;color:#374151;line-height:1.6;">${followUp}</p>
      <div style="margin:20px 0;text-align:center;">
        <a href="${escapeHtml(opts.dashboardUrl)}" style="background-color:#16a34a;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">Odpri nadzorno ploščo</a>
      </div>
    `,
  })
  await sendMail({
    to: opts.to,
    subject: `Prevzem #${opts.orderShort} — ${slSubject[opts.action]}`,
    text,
    html,
  })
}