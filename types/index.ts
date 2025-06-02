import type { User, UserRole } from "../lib/types";
import type { Icon } from "lucide-react";
import { Icons } from "@/components/shared/icons";

// Reusable base types
type IconName = keyof typeof Icons;
type ImagePath = string;

/**
 * Site Configuration
 */
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: ImagePath;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

/**
 * Navigation Items
 */
export type BaseNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: IconName;
  badge?: number;
};

export type MainNavItem = BaseNavItem;

export type SidebarNavItem = {
  title: string;
  items: BaseNavItem[];
  authorizeOnly?: UserRole;
  icon?: IconName;
};

/**
 * Documentation Configuration
 */
export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

/**
 * Subscription Plans
 */
export const PLAN_NAMES = ["free", "pro", "enterprise"] as const;
export type PlanName = typeof PLAN_NAMES[number];

export type StripeIds = {
  monthly: string | null;
  yearly: string | null;
};

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
  stripeIds: StripeIds;
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
 * Feature Comparison Table
 */
export type FeatureComparison = {
  feature: string;
  tooltip?: string;
  highlight?: boolean;
} & Record<PlanName, string | boolean | null>;

/**
 * Landing Page Content
 */
export type InfoListItem = {
  icon: IconName;
  title: string;
  description: string;
};

export type LandingInfoSection = {
  title: string;
  image: ImagePath;
  description: string;
  list: InfoListItem[];
};

export type LandingFeature = {
  title: string;
  description: string;
  link: string;
  icon: IconName;
  comingSoon?: boolean;
};

export type Testimonial = {
  name: string;
  job: string;
  image: ImagePath;
  review: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

/**
 * Marketing Configuration
 */
export type MarketingConfig = {
  mainNav: MainNavItem[];
  features: LandingFeature[];
  testimonials: Testimonial[];
  pricingComparison: FeatureComparison[];
};

/**
 * Legacy Types (for backward compatibility)
 * Consider migrating these to use the more specific types above
 */
export type InfoLdg = Omit<LandingInfoSection, 'list'> & {
  list: {
    title: string;
    description: string;
    icon: IconName;
  }[];
};

export type FeatureLdg = LandingFeature;

// types/index.ts
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
}

// export interface DocsConfig {
//   sidebarNav: SidebarNavItem[];
//   // ... other config properties if they exist
// }

export type TestimonialType = Omit<Testimonial, 'rating'>;
