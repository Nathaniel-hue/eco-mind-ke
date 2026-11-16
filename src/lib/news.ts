export type Story = {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  published: string | null;
  region: string;
};
export const NEWS_CATEGORIES = [
  "All",
  "Clean Energy",
  "Biodiversity",
  "Oceans",
  "Circular Tech",
  "Climate Policy",
];
export const FALLBACK_STORIES: Story[] = [
  {
    title: "The ozone layer is recovering",
    summary:
      "The UN's assessment explains the long-term recovery of Earth's protective ozone layer.",
    url: "https://www.unep.org/news-and-stories/press-release/ozone-layer-recovery-track-helping-avoid-global-warming-05degc",
    source: "UNEP",
    category: "Climate Policy",
    published: null,
    region: "Global",
  },
  {
    title: "Protecting life on the high seas",
    summary: "Explore the UN agreement on conserving marine biodiversity beyond national borders.",
    url: "https://www.un.org/bbnj/",
    source: "United Nations",
    category: "Oceans",
    published: null,
    region: "Global",
  },
];
