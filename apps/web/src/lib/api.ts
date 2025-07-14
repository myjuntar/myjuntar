import fetcher from "./fetcher";

// Set password after OTP verification
export async function setPassword(email: string, password: string, phone_number?: string) {
  return await fetcher.post('/api/auth/set-password', {
    email,
    password,
    ...(phone_number && { phone_number }),
  })
}


export async function forgotPassword(email: string) {
  return await fetcher.post('/api/auth/forgot-password', { email })
}

export async function resetPassword(email: string, otp: string, password: string) {
  return await fetcher.post('/api/auth/reset-password', { email, otp, password })
}

export async function loginOtpRequest(email: string) {
  return await fetcher.post('/api/auth/login-otp-request', { email })
}

export async function loginOtpVerify(email: string, otp: string) {
  return await fetcher.post('/api/auth/login-otp-verify', { email, otp })
}

export async function socialLogin(idToken: string) {
  return await fetcher.post('/api/auth/social-login', { idToken })
}

export async function login(email: string, password: string) {
  return await fetcher.post('/api/auth/login', { email, password })
}

export async function signupRequest(data: {
  email: string
  password: string
  full_name?: string
  phone_number?: string
}) {
  return await fetcher.post('/api/auth/signup', data)
}


export async function verifySignupOtp(email: string, otp: string) {
  return await fetcher.post('/api/auth/verify-otp', { email, otp })
}
