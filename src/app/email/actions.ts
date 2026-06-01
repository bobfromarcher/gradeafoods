'use server'

export async function captureEmail(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }
  // In a real app, store the email in a database or mailing list.
  // For the v1 thin slice, we log it and return success.
  console.log('Email captured:', email)
  return { success: true, message: 'Thanks! We’ll be in touch.' }
}
