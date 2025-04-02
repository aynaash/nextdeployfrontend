// "use server";

// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

// import { stripe } from "@/lib/stripe";
// import { absoluteUrl } from "@/lib/utils";

// export type responseAction = {
//   status: "success" | "error";
//   stripeUrl?: string;
// };

// const billingUrl = absoluteUrl("/dashboard/billing");

// export async function openCustomerPortal(
//   userStripeId: string,
// ): Promise<responseAction> {
//   let redirectUrl: string = "";

//   try {
//     const session = await auth();

//     if (!session?.user || !session?.user.email) {
//       throw new Error("Unauthorized");
//     }

//     if (userStripeId) {
//       const stripeSession = await stripe.billingPortal.sessions.create({
//         customer: userStripeId,
//         return_url: billingUrl,
//       });

//       redirectUrl = stripeSession.url as string;
//     }
//   } catch (error) {
//     throw new Error("Failed to generate user stripe session");
//   }

//   redirect(redirectUrl);
// }

// "use server";

// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

// import { getUserSubscriptionPlan } from "@/lib/subscription";
// import { absoluteUrl } from "@/lib/utils";

// export type responseAction = {
//   status: "success" | "error";
//   paystackUrl?: string;
// };

// // The URL for the billing page where users will be redirected after a successful transaction
// const billingUrl = absoluteUrl("/pricing");

// // Paystack API keys and endpoint
// const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY; // Store in environment variable for security
// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Store in environment variable for security
// const PAYSTACK_PAYMENT_URL = "https://api.paystack.co/transaction/initialize"; // Paystack endpoint for initializing a payment

// export async function generateUserPaystack(
//   priceId: string,
// ): Promise<responseAction> {
//   let redirectUrl: string = "";

//   try {
//     // Authenticate the user and retrieve their session
//     const session = await auth();
//     const user = session?.user;

//     // Ensure the user is authenticated (has an email and ID)
//     if (!user || !user.email || !user.id) {
//       throw new Error("Unauthorized");
//     }

//     // Get the user's subscription plan to determine if they are on a paid plan
//     const subscriptionPlan = await getUserSubscriptionPlan(user.id);

//     // Check if the user is on a paid plan and has a Paystack customer ID
//     if (subscriptionPlan.isPaid && subscriptionPlan.paystackCustomerId) {
//       // User on Paid Plan - Here we should create a billing portal if needed
//       // But since Paystack doesn't have a built-in billing portal like Stripe, we redirect the user to the billing page
//       redirectUrl = billingUrl; // You may want to handle this differently in your UI
//     } else {
//       // User on Free Plan - Proceed to create a payment session for upgrading to a paid plan

//       // Initialize a Paystack payment session by making an API request
//       const response = await fetch(PAYSTACK_PAYMENT_URL, {
//         method: "POST", // HTTP POST method for creating a transaction
//         headers: {
//           // Authorization header for Paystack API, using the secret key
//           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json", // Sending data as JSON
//         },
//         // Payload sent to Paystack API for initializing the payment
//         body: JSON.stringify({
//           email: user.email, // User's email to send invoice and updates
//           amount: parseInt(priceId) * 100, // Amount in kobo (1 Naira = 100 kobo)
//           callback_url: billingUrl, // URL to redirect the user to after payment completion
//           metadata: {
//             userId: user.id, // Store user ID in metadata for later reference
//           },
//         }),
//       });

//       // Parse Paystack's response
//       const data = await response.json();

//       // Check if the Paystack session creation was successful
//       if (data.status !== "success") {
//         throw new Error("Failed to create Paystack payment session");
//       }

//       // Paystack returns an authorization URL for the user to complete the payment
//       redirectUrl = data.data.authorization_url;
//     }
//   } catch (error) {
//     // Catch any errors during the process and log them
//     console.error(error);
//     throw new Error("Failed to generate user Paystack session");
//   }

//   // Redirect the user to the Paystack payment page using the generated URL
//   redirect(redirectUrl);
// }

// "use server";

// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

// import { absoluteUrl } from "@/lib/utils";

// // Define the response type for the operation
// export type responseAction = {
//   status: "success" | "error"; // Status to determine if the operation was successful or not
//   paystackUrl?: string; // The URL to which the user should be redirected (Paystack checkout URL)
// };

// // Billing URL to redirect after customer completes the session
// const billingUrl = absoluteUrl("/dashboard/billing");

// // Function to open the Paystack checkout for subscription
// export async function openCustomerPortal(
//   userEmail: string, // The user's email (used to create a Paystack customer)
//   amount: number, // Subscription amount for the user
//   planId: string, // Plan ID or unique identifier for the plan
// ): Promise<responseAction> {
//   let redirectUrl: string = "";

//   try {
//     // Step 1: Authenticate the user session
//     const session = await auth(); // Get the user session using the authentication utility

//     // Step 2: Check if the user is authenticated (i.e., session exists and user has an email)
//     if (!session?.user || !session?.user.email) {
//       throw new Error("Unauthorized"); // If not authenticated, throw an error
//     }

//     // Step 3: Call Paystack API to create a checkout session for the user
//     const paystackResponse = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Paystack secret key
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: userEmail, // The email of the user making the payment
//           amount: amount * 100, // Paystack requires the amount to be in kobo (i.e., multiply by 100)
//           callback_url: billingUrl, // URL to redirect after payment is completed or failed
//           plan_id: planId, // Optional plan ID for your reference
//         }),
//       },
//     );

//     const paystackData = await paystackResponse.json();

//     // Step 4: Check if Paystack response is successful
//     if (paystackData.status === "success") {
//       // The Paystack checkout URL
//       redirectUrl = paystackData.data.authorization_url;
//     } else {
//       throw new Error("Failed to initialize Paystack transaction.");
//     }
//   } catch (error) {
//     // If an error occurs at any step, throw a generic error message
//     throw new Error("Failed to generate Paystack checkout session");
//   }

//   // Step 5: Redirect the user to Paystack checkout page
//   redirect(redirectUrl); // Redirect to the Paystack checkout URL where the user can complete the payment
// }
