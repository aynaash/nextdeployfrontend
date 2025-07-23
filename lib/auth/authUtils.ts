// import { toast } from "sonner";
// import { authClient as client } from "../../auth-client";
// // 📩 Send invitation email (for team/org use)
// export async function reactInvitationEmail(email: string) {
//   try {
//     await client.organization.invite({ email });
//     toast.success("Invitation sent successfully.");
//   } catch (err: any) {
//     toast.error(err?.message || "Failed to send invitation.");
//   }
// }
//
// // 🔑 Send password reset email
// export async function reactResetPasswordEmail(email: string) {
//   try {
//     await client.signIn.sendResetPasswordEmail({ email });
//     toast.success("Reset email sent. Check your inbox.");
//   } catch (err: any) {
//     toast.error(err?.message || "Failed to send reset email.");
//   }
// }
//
// // 🔁 Resend verification or magic link
// export async function resend(email: string) {
//   try {
//     await client.signIn.sendMagicLink({ email });
//     toast.success("Verification link resent.");
//   } catch (err: any) {
//     toast.error(err?.message || "Could not resend email.");
//   }
// }
//
// // 🪄 Handle magic link auth fallback
// export async function handleMagicLink(email: string) {
//   try {
//     const result = await client.signIn.magicLink({ email });
//     if (result.ok) {
//       toast.success("Check your email for the login link.");
//     }
//   } catch (err: any) {
//     toast.error(err?.message || "Magic link sign-in failed.");
//   }
// }
//
// // 🔐 Fallback: Use password if passkey fails
// export async function handlePasskeyFallback(email: string, password: string) {
//   try {
//     const result = await client.signIn.password({ email, password });
//     if (result.ok) {
//       toast.success("Signed in successfully.");
//     }
//   } catch (err: any) {
//     toast.error(err?.message || "Fallback password sign-in failed.");
//   }
// }
