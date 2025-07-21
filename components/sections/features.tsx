import Link from "next/link";
import { features } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section id="features" className="py-28">
      <MaxWidthWrapper className="text-center">
        <HeaderSection
          label="Features"
          title="Discover all features"
          subtitle="Built for DevOps Excellence — Everything You Need to Deploy with Confidence"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const iconName = feature.icon as keyof typeof Icons;
            const Icon = Icons[iconName] || Icons.nextjs;

            return (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={<Icon />}
                href={feature.link}
              />
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-2xl border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg md:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl transition-all duration-500 group-hover:-translate-y-1/4 group-hover:opacity-30 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
      />
      
      <div className="relative z-10">
        <div className="relative flex size-12 items-center justify-center rounded-xl border bg-background shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
          {icon}
        </div>

        <h3 className="mt-6 text-lg font-medium text-foreground">{title}</h3>
        <p className="mt-3 text-muted-foreground">{description}</p>

        {href && (
          <Button
            variant="link"
            className="mt-4 px-0 text-primary hover:underline"
          >
            <Link href={href}>Learn more →</Link>
          </Button>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href} legacyBehavior>{content}</Link> : content;
}
