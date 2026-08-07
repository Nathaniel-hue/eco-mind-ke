import { WifiOff, BookOpen } from "lucide-react";

export function ModesSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border bg-secondary/60 p-6 shadow-card sm:p-8">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-card">
          <WifiOff className="h-5 w-5 text-earth" />
        </div>
        <h2 className="font-display text-2xl">Offline mode</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A built-in library of common sustainability questions answers instantly, with no
          connection needed. Ideal for classrooms and patchy networks — you can make it the only
          source from Settings.
        </p>
      </div>
      <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-accent">
          <BookOpen className="h-5 w-5 text-leaf" />
        </div>
        <h2 className="font-display text-2xl">Online research mode</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          For anything the library doesn't cover, we look it up and summarise reputable
          references — encyclopedias, agencies and journals — and list every source alongside the
          answer so you can check the reasoning yourself.
        </p>
      </div>
    </section>
  );
}
