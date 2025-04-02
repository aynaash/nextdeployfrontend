import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";





export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "For Small Projects & Testing",
    benefits: [
      "Up to 10 deployments per month",
      "Basic analytics and reporting",
      "Access to standard deployment templates",
      "Basic SSH support for deployments",
    ],
    limitations: [
      "No access to advanced monitoring tools",
      "No priority customer support",
      "Limited storage for deployments",
      "No custom integrations or APIs",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null, // Use actual Stripe IDs if needed
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "For Growing Teams & Advanced Features",
    benefits: [
      "Up to 50 deployments per month",
      "Advanced analytics and reporting",
      "Access to deployment templates and custom branding",
      "Priority support with email and chat",
      "Access to monthly webinars and training sessions",
      "Basic API Access for custom integrations",
    ],
    limitations: [
      "Limited storage for deployments",
      "No real-time monitoring and advanced alerting",
    ],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "For High-Volume Deployments & Enterprise Support",
    benefits: [
      "Unlimited deployments",
      "Real-time analytics and monitoring",
      "Access to all deployment templates, custom branding, and advanced features",
      "24/7 customer support (email & chat)",
      "Personalized onboarding and account management",
      "Enhanced API Access for custom integrations",
      "Advanced reporting with custom dashboards",
    ],
    limitations: [],
    prices: {
      monthly: 75,
      yearly: 720,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];
export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise", // Consider adding an "Enterprise" plan for very large teams or custom enterprise features.
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Number of Deployments",
    starter: "10/month",
    pro: "50/month",
    business: "Unlimited",
    enterprise: "Custom",
    tooltip:
      "Limits are based on the plan's tier. Higher plans offer more deployments.",
  },
  {
    feature: "Analytics & Monitoring",
    starter: "Basic",
    pro: "Advanced",
    business: "Real-time",
    enterprise: "Custom",
    tooltip:
      "Advanced monitoring tools and reporting are available for higher plans.",
  },
  {
    feature: "Customer Support",
    starter: "Basic",
    pro: "Email & Chat",
    business: "24/7 Support",
    enterprise: "Dedicated Support",
    tooltip:
      "Higher-tier plans include faster response times and 24/7 support.",
  },
  {
    feature: "Custom Integrations",
    starter: "No",
    pro: "Basic API Access",
    business: "Enhanced API Access",
    enterprise: "Full Access",
    tooltip: "Custom integrations are available starting from the Pro plan.",
  },
  {
    feature: "Deployment Templates",
    starter: "Standard",
    pro: "Advanced & Customizable",
    business: "All Templates, Custom Branding",
    enterprise: "Full Customization",
    tooltip:
      "The Business plan includes all templates and custom branding for deployments.",
  },
  {
    feature: "Webinars & Training",
    starter: "None",
    pro: "Monthly Webinars",
    business: "Monthly Webinars + Exclusive Training",
    enterprise: "Tailored Training Sessions",
    tooltip:
      "Pro and higher plans offer exclusive webinars and training opportunities.",
  },
  {
    feature: "Storage & Resources",
    starter: "Limited",
    pro: "More Storage",
    business: "Unlimited Storage",
    enterprise: "Enterprise Resources",
    tooltip:
      "Higher plans include more storage and more powerful resources for deployments.",
  },
  {
    feature: "Onboarding Assistance",
    starter: "No",
    pro: "Self-Service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip:
      "Business and Enterprise plans provide full onboarding assistance and account management.",
  },
  {
    feature: "Custom Branding",
    starter: "No",
    pro: "Available",
    business: "Custom Branding + All Templates",
    enterprise: "Unlimited Branding & Custom Solutions",
    tooltip:
      "Custom branding starts at the Pro plan and is available in higher plans with more options.",
  },
];