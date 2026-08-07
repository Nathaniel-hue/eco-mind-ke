import { Droplets, Recycle, Bus, ShoppingBasket, Zap, Sprout } from "lucide-react";

const TIPS = [
  {
    icon: Zap,
    title: "Fix the big three first",
    body: "Home heating, car travel and diet drive most household emissions. Small wins elsewhere rarely match one change here.",
  },
  {
    icon: Bus,
    title: "Combine trips, don't just shorten them",
    body: "A cold engine burns the most fuel. Chaining errands into one journey often beats swapping cars.",
  },
  {
    icon: ShoppingBasket,
    title: "Buy less, choose durable",
    body: "Doubling how long you use something roughly halves its yearly footprint — no new purchase required.",
  },
  {
    icon: Recycle,
    title: "Recycling is the last step",
    body: "Refuse, reduce and reuse come first. Clean, dry, sorted material is what actually gets recycled.",
  },
  {
    icon: Droplets,
    title: "Hot water is energy",
    body: "Most of the footprint of washing is heating the water, so cooler cycles cut more than shorter ones.",
  },
  {
    icon: Sprout,
    title: "Plants over packaging",
    body: "What's on the plate usually matters far more than the wrapper it arrived in.",
  },
];

export function TipsSection() {
  return (
    <section>
      <h2 className="font-display text-3xl">Sustainability tips</h2>
      <p className="mt-2 text-muted-foreground">
        Evidence-backed habits that make a measurable difference.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-accent">
              <Icon className="h-5 w-5 text-leaf" />
            </div>
            <div className="font-medium">{title}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
