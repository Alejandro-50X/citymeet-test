// sendOtp.js
import { supabase } from './supabaseClient'

export async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({ email })

  if (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}
