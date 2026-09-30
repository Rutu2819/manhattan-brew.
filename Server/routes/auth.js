import express from 'express'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabaseClient.js'
import { generateOtp, hashOtp, compareOtp } from '../utils/otp.js'
import { sendOtpEmail } from '../utils/sendEmail.js'
import {requireAuth} from '../middleware/auth.js'

const router = express.Router()

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const otp = generateOtp()
    const codeHash = await hashOtp(otp)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min

    const { error } = await supabase
      .from('otp_codes')
      .insert({ email, code_hash: codeHash, expires_at: expiresAt })

    if (error) throw error

    await sendOtpEmail(email, otp)
    res.json({ success: true, message: 'OTP sent to email' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' })

  try {
    const { data: otpRows, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error || !otpRows?.length) {
      return res.status(400).json({ error: 'No OTP found, please request a new one' })
    }

    const otpRow = otpRows[0]

    if (new Date(otpRow.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' })
    }

    const isValid = await compareOtp(code, otpRow.code_hash)
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP' })

    await supabase.from('otp_codes').update({ verified: true }).eq('id', otpRow.id)

    // find or create user
    let { data: user } = await supabase.from('users').select('*').eq('email', email).single()
    if (!user) {
      const { data: newUser, error: insertErr } = await supabase
        .from('users')
        .insert({ email })
        .select()
        .single()
      if (insertErr) throw insertErr
      user = newUser
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({ success: true, token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Verification failed' })
  }
})
router.patch ('/update-name', requireAuth, async (req, res) => {
  const body = req.body
  const userId = req.user.userId
  const name = body.name

  if (!name) return res.status(400).json({ error: 'Name is required' })

  try{
    const {data, error} = await supabase.from('users').update({ name }).eq('id', userId).select().single()
    if (error) throw error
    res.json({ success: true, user: data })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update name' })
  }
})


export default router