import nodeMailer from 'nodemailer'
import config from '../config'

export const sendMail = async (to: string, html: string) => {
  const transporter = nodeMailer.createTransport({
    host: config.mail_host,
    port: config.mail_host_port,
    secure: config.node_dev === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.mail_auth_user,
      pass: config.mail_auth_password,
    },
  })

  await transporter.sendMail({
    from: config.mail_auth_user, // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minutes', // Subject line
    text: 'Reset your password within 10 minutes', // plain text body
    html, // html body
  })
}
