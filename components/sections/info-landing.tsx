import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface InfoLdg {
  title: string;
  description: string;
  image: string;
  list: Array<{
    title: string;
    description: string;
    icon?: keyof typeof Icons;
  }>;
}

interface InfoLandingProps {
  data: InfoLdg;
  reverse?: boolean;
}

export default function InfoLanding({ data, reverse = false }: InfoLandingProps) {
  return (
    <section className="py-14">
      <MaxWidthWrapper>
        <div className={cn(
          "flex flex-col gap-12 lg:gap-16",
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        )}>
          {/* Image Section */}
          <div className="lg:flex-1">
            <div className="overflow-hidden rounded-xl border bg-background shadow-lg">
              <div className="aspect-video">
                <Image
                  className="size-full object-cover object-center"
                  src={data.image}
                  alt={data.title}
                  width={800}
                  height={450}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:flex-1">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {data.title}
              </h2>
              
              <p className="text-lg text-muted-foreground">
                {data.description}
              </p>

              <ul className="space-y-6">
                {data.list.map((item, index) => {
                  const Icon = Icons[item.icon || "check"];
                  return (
                    <li key={index} className="flex gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
