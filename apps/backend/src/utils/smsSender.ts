// utils/smsSender.ts
export async function sendOtpSms(phone: string, otp: string) {
  console.log(`📲 Sending OTP ${otp} to phone ${phone}`);
  // Later: integrate Twilio / SMS provider here
}
