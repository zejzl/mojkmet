import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.MOJKMET_EMAIL_SERVER || 'mail.mojkmet.eu',
  port: parseInt(process.env.MOJKMET_SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.MOJKMET_EMAIL_USER || 'info@mojkmet.eu',
    pass: process.env.MOJKMET_EMAIL_PASS || '',
  },
})

export async function sendMail(options: {
  to: string
  subject: string
  text: string
  html?: string
}) {
  return transporter.sendMail({
    from: '"mojkmet.eu" <info@mojkmet.eu>',
    ...options,
  })
}
