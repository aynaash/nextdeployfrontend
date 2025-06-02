import { MarketingConfig } from "../types/index"
import { Icons } from "@/components/shared/icons"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  features: [
    {
      title: "Feature 1",
      description: "Description of feature 1",
      link: "/feature-1",
      icon: "rocket" // Must be a key from your Icons component
    },
    // Add more features as needed
  ],
  testimonials: [
    {
      name: "John Doe",
      job: "CEO at Company",
      image: "/images/testimonials/john-doe.jpg",
      review: "This product changed our business!",
      rating: 5
    },
    // Add more testimonials as needed
  ],
  pricingComparison: [
    {
      feature: "Basic Feature",
      free: true,
      pro: true,
      enterprise: true
    },
    {
      feature: "Advanced Feature",
      tooltip: "This is only for paid plans",
      free: false,
      pro: true,
      enterprise: true
    },
    // Add more comparison rows as needed
  ]
}
