import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export async function sendOtpEmail(toEmail, otp) {
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'Manhattan Brew' },
      to: [{ email: toEmail }],
      subject: 'Your Manhattan Brew login code',
      htmlContent: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Manhattan Brew</h2>
          <p>Your one-time login code is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  )
}