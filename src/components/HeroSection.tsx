import heroAsset from "@/assets/ecomind-hero-forest.jpg.asset.json";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden sm:h-[56vh]">
        <img
          src={heroAsset.url}
          alt="Sunlight streaming through a dense green forest"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-5 text-center">
          <h1 className="animate-fade-up font-display text-4xl leading-[1.1] text-white sm:text-6xl">
            Helping you make smarter, more sustainable decisions.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            EcoMind evaluates everyday environmental choices — what you buy, eat, travel in and
            throw away — and suggests practical alternatives you can actually act on, with the
            reasoning and sources laid out plainly.
          </p>
        </div>

        <div className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm">
          Photo by{" "}
          <a
            href="https://unsplash.com/@sebastian_unrau"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Sebastian Unrau
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/photos/CoD2Q92UAor"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Unsplash
          </a>
        </div>
      </div>
    </section>
  );
}
