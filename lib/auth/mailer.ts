// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }
//
// export async function sendEmail(options: EmailOptions) {
//   // In production, replace with your actual email service (SendGrid, Postmark, etc.)
//   console.log("Sending email:", {
//     to: options.to,
//     subject: options.subject,
//     html: options.html,
//   });
//
//   return { success: true };
// }
//
// export async function sendVerificationEmail(email: string, token: string) {
//   const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
//
//   return sendEmail({
//     to: email,
//     subject: "Verify your email address",
//     html: `Click <a href="${verificationUrl}">here</a> to verify your email.`,
//   });
// }
//
// export async function sendPasswordResetEmail(email: string, token: string) {
//   const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
//
//   return sendEmail({
//     to: email,
//     subject: "Reset your password",
//     html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
//   });
// }
