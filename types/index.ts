import type { User, UserRole } from "../lib/types";
import type { Icon } from "lucide-react";
import { Icons } from "@/components/shared/icons";

/**
 * Site configuration
 */
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

/**
 * Navigation items
 */
export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;
export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

/**
 * Documentation configuration
 */
export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

/**
 * Subscription plans configuration
 */
export const PLAN_NAMES = ["free", "pro", "enterprise"] as const;
export type PlanName = typeof PLAN_NAMES[number];

export type SubscriptionPlan = {
  name: PlanName;
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
  featured?: boolean;
  recommended?: boolean;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
    hasActiveSubscription?: boolean;
  };

/**
 * Plans comparison table types
 */
export type FeatureComparison = {
  feature: string;
  tooltip?: string;
  highlight?: boolean;
} & Record<PlanName, string | boolean | null>;

/**
 * Landing page content types
 */
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type LandingInfoSection = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type LandingFeature = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
  comingSoon?: boolean;
};

export type Testimonial = {
  name: string;
  job: string;
  image: string;
  review: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

/**
 * Marketing configuration
 */
export type MarketingConfig = {
  mainNav: MainNavItem[];
  features: LandingFeature[];
  testimonials: Testimonial[];
  pricingComparison: FeatureComparison[];
};
