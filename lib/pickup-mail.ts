import { sendMail } from './mailer'
import { escapeHtml } from './validation'

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
  const text = `Pozdravljeni,\n\n${opts.proposerLabel} je poslal(a) predlog spremembe termina prevzema za naročilo #${opts.orderShort} (${opts.farmName}).\n\nPredlagan termin: ${opts.proposed}${reasonText}\n\n${opts.responseHint}\n\n${opts.dashboardUrl}`
  const html = `<p>Pozdravljeni,</p><p><strong>${escapeHtml(opts.proposerLabel)}</strong> je poslal(a) predlog spremembe termina prevzema za naročilo <strong>#${escapeHtml(opts.orderShort)}</strong> (${escapeHtml(opts.farmName)}).</p><p>Predlagan termin: <strong>${escapeHtml(opts.proposed)}</strong>${opts.reason ? `<br/>Razlog: ${escapeHtml(opts.reason)}` : ''}</p><p>${escapeHtml(opts.responseHint)}</p><p><a href="${escapeHtml(opts.dashboardUrl)}">${escapeHtml(opts.dashboardUrl)}</a></p>`
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
  const text = `Pozdravljeni,\n\nVaš predlog za naročilo #${opts.orderShort} (${opts.farmName}) ${sl[opts.action]}.\n\nDogovorjen predlagan termin: ${opts.proposed}\n\n` + `${opts.action === 'ACCEPT' ? 'Hvala za uskladitev.' : 'Če je prišlo do napake, se lahko dogovorite za nov termin.'}\n\n${opts.dashboardUrl}`
  const html = `<p>Pozdravljeni,</p><p>Vaš predlog za naročilo <strong>#${escapeHtml(opts.orderShort)}</strong> (${escapeHtml(opts.farmName)}) ${sl[opts.action]}.</p><p>Dogovorjen predlagan termin: <strong>${escapeHtml(opts.proposed)}</strong></p><p>${opts.action === 'ACCEPT' ? 'Hvala za uskladitev.' : 'Če je prišlo do napake, se lahko dogovorite za nov termin.'}</p><p><a href="${escapeHtml(opts.dashboardUrl)}">${escapeHtml(opts.dashboardUrl)}</a></p>`
  await sendMail({
    to: opts.to,
    subject: `Prevzem #${opts.orderShort} — ${opts.action === 'ACCEPT' ? 'predlog sprejet' : opts.action === 'REJECT' ? 'predlog zavrnjen' : 'predlog preklican'}`,
    text,
    html,
  })
}