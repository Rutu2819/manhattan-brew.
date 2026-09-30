import bcrypt from 'bcryptjs'

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit
}

export async function hashOtp(otp) {
  return bcrypt.hash(otp, 10)
}

export async function compareOtp(otp, hash) {
  return bcrypt.compare(otp, hash)
}