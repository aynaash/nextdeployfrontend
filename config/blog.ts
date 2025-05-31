// Blog categories tailored for NextDeploy (deployment-focused content)
export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education" | "tutorial" | "case-studies";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description:
      "The latest updates, features, and announcements from NextDeploy.",
  },
  {
    title: "Education",
    slug: "education",
    description:
      "Educational articles on deploying and managing Next.js apps with NextDeploy.",
  },
  {
    title: "Tutorials",
    slug: "tutorial",
    description:
      "Step-by-step guides to help you set up and optimize your deployments.",
  },
  {
    title: "Case Studies",
    slug: "case-studies",
    description:
      "Real-world examples of how teams are using NextDeploy for scalable deployments.",
  },
];

// Blog authors, representing key contributors to NextDeploy
export const BLOG_AUTHORS = {
  mickasmt: {
    name: "Mickasmt",
    image: "/_static/avatars/mickasmt.png",
    twitter: "miickasmt",
  },
  shadcn: {
    name: "Shadcn",
    image: "/_static/avatars/shadcn.jpeg",
    twitter: "shadcn",
  },
  janeDoe: {
    name: "Jane Doe",
    image: "/_static/avatars/jane-doe.png", // Replace with appropriate avatar image
    twitter: "janedoe_dev",
  },
  johnSmith: {
    name: "John Smith",
    image: "/_static/avatars/john-smith.png", // Replace with appropriate avatar image
    twitter: "johnsmith_dev",
  },
};
export type AuthorUsername = keyof typeof BLOG_AUTHORS;
