import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#242424] text-white">
      <div className="absolute inset-0 overflow-hidden">
        {/* Top left orbs gradient background */}
        <div className="absolute top-0 left-0 w-[800px] h-[600px]">
          <Image
            src="/images/gradient-orb.png"
            alt="Background gradient top left"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        {/* Bottom right orbs gradient background */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px]">
          <Image
            src="/images/gradient-orb2.png"
            alt="Background gradient bottom right"
            fill
            className="object-cover opacity-20 rotate-180"
            priority
          />
        </div>
        {/* Subtle dots overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Hero Section */}
      <main className="relative max-w-6xl mx-auto px-6 pt-[152px]">
        <div className="space-y-8 text-center">
          <h1 className="font-['Flavors'] text-[6rem] tracking-[-0.02em] leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-[#b17f01] via-[#7a7a7a] to-[#a600c3]">
            The Best Nextjs / Better Auth Starter theme
          </h1>

          <p className="text-xl text-[#7a7a7a] max-w-xl mx-auto">
            The all in one nextjs starter theme with betterauth + Neon db.
          </p>
        </div>

        {/* Product Preview */}
        <div className="relative mt-10">
          <Image
            src="/images/app-preview.png"
            alt="Better Auth Preview"
            width={1400}
            height={700}
            className="object-contain w-full h-full rounded-lg"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
        </div>
      </main>
    </div>
  );
}
