export type SustainabilityScores = {
  overall: number;
  environmental: number;
  economic: number;
  social: number;
};

export type Alternative = { title: string; why: string };

export type SustainabilityAnswer = {
  answer: string;
  scores: SustainabilityScores;
  alternatives: Alternative[];
  tips: string[];
  sources?: { title: string; url: string }[];
  category?: string;
  relevant?: boolean;
};

export type OfflineEntry = {
  keywords: string[];
  question: string;
  data: SustainabilityAnswer;
};

export const OFFLINE_KB: OfflineEntry[] = [
  {
    keywords: ["recycle glass", "glass recycle", "glass bottle recycle"],
    question: "Can I recycle glass?",
    data: {
      answer:
        "Yes. Glass is 100% recyclable and can be recycled endlessly without loss of quality. Rinse containers and remove lids before placing them in your glass recycling bin.",
      scores: { overall: 92, environmental: 96, economic: 85, social: 90 },
      alternatives: [
        { title: "Reuse jars at home", why: "Extends life before recycling and saves energy." },
        { title: "Choose refillable glass", why: "Refill systems avoid remelting entirely." },
      ],
      tips: ["Rinse before recycling", "Separate by color when required", "Never mix with ceramics"],
      category: "Recycling",
    },
  },
  {
    keywords: ["compost banana", "banana peel"],
    question: "Should I compost banana peels?",
    data: {
      answer:
        "Absolutely. Banana peels are rich in potassium and break down quickly, making them excellent compost material.",
      scores: { overall: 95, environmental: 98, economic: 90, social: 88 },
      alternatives: [
        { title: "Bokashi bin", why: "Ferments food scraps indoors, odorless." },
        { title: "Worm bin", why: "Turns peels into premium fertilizer fast." },
      ],
      tips: ["Chop for faster decomposition", "Mix with dry leaves", "Avoid stickers"],
      category: "Composting",
    },
  },
  {
    keywords: ["walking better driving", "walk vs drive", "walking driving"],
    question: "Is walking better than driving?",
    data: {
      answer:
        "For short distances, walking is dramatically better than driving — zero emissions, zero fuel cost, and clear health benefits.",
      scores: { overall: 96, environmental: 100, economic: 95, social: 92 },
      alternatives: [
        { title: "Cycling", why: "Covers longer distances with the same zero emissions." },
        { title: "Public transport", why: "Best when weather or distance rules out walking." },
      ],
      tips: ["Walk trips under 2 km", "Combine errands", "Use walking as daily exercise"],
      category: "Transport",
    },
  },
  {
    keywords: ["turn off lights", "lights off save"],
    question: "Does turning lights off save energy?",
    data: {
      answer:
        "Yes. Turning lights off when leaving a room reduces electricity consumption and CO₂ emissions from power generation.",
      scores: { overall: 88, environmental: 90, economic: 92, social: 80 },
      alternatives: [
        { title: "LED bulbs", why: "Use ~80% less energy than incandescent." },
        { title: "Motion sensors", why: "Automate savings without thinking about it." },
      ],
      tips: ["Prefer natural daylight", "Use task lighting", "Install dimmers"],
      category: "Energy",
    },
  },
  {
    keywords: ["bottled water", "buy water bottle"],
    question: "Should I buy bottled water every day?",
    data: {
      answer:
        "No. Daily bottled water use is one of the least sustainable habits — high plastic waste, high transport emissions, and up to 1,000× the cost of tap water.",
      scores: { overall: 22, environmental: 15, economic: 20, social: 40 },
      alternatives: [
        { title: "Reusable bottle + tap", why: "Eliminates single-use plastic entirely." },
        { title: "Home filter pitcher", why: "Improves taste without packaging waste." },
      ],
      tips: ["Carry a stainless steel bottle", "Install a filter if tap taste is off", "Refill at public fountains"],
      category: "Consumption",
    },
  },
  {
    keywords: ["plastic bag", "plastic bags alternative"],
    question: "What are better alternatives to plastic bags?",
    data: {
      answer:
        "Single-use plastic bags are a top polluter of oceans. Switching to reusable options reduces plastic waste dramatically.",
      scores: { overall: 30, environmental: 20, economic: 55, social: 50 },
      alternatives: [
        { title: "Cotton tote", why: "Reusable hundreds of times, biodegradable." },
        { title: "Foldable nylon bag", why: "Fits in a pocket, replaces dozens of plastics." },
        { title: "Paper bags", why: "Biodegradable when reused a few times." },
      ],
      tips: ["Keep a tote by the door", "Wash reusables regularly", "Refuse bags at checkout"],
      category: "Consumption",
    },
  },
  {
    keywords: ["pizza box recycle"],
    question: "Can I recycle pizza boxes?",
    data: {
      answer:
        "Only if clean. Grease and cheese contaminate paper recycling; tear off soiled sections and compost or trash them.",
      scores: { overall: 60, environmental: 65, economic: 60, social: 55 },
      alternatives: [
        { title: "Compost greasy parts", why: "Grease is fine in compost, not in paper mills." },
        { title: "Order in reusable containers", why: "Some pizzerias offer deposit systems." },
      ],
      tips: ["Separate clean lid", "Compost soiled base", "Flatten before recycling"],
      category: "Recycling",
    },
  },
  {
    keywords: ["electric car", "buy ev", "should i buy ev"],
    question: "Should I buy an electric car?",
    data: {
      answer:
        "EVs are significantly cleaner than petrol cars over their lifetime, especially where the grid is decarbonizing. Best if you drive frequently and can charge at home.",
      scores: { overall: 75, environmental: 82, economic: 68, social: 75 },
      alternatives: [
        { title: "E-bike", why: "10× cheaper, near-zero emissions for city trips." },
        { title: "Public transport pass", why: "Zero ownership cost and lower footprint." },
        { title: "Car-sharing", why: "Access without full ownership impact." },
      ],
      tips: ["Charge with renewable tariff", "Consider battery longevity", "Compare lifecycle emissions"],
      category: "Transport",
    },
  },
  {
    keywords: ["food waste reduce", "reduce food waste"],
    question: "How can I reduce food waste?",
    data: {
      answer:
        "Planning meals, storing food properly, and using leftovers can cut household food waste by more than half — reducing methane emissions and saving money.",
      scores: { overall: 90, environmental: 92, economic: 95, social: 85 },
      alternatives: [
        { title: "Meal planning", why: "Buy only what you'll eat." },
        { title: "Compost scraps", why: "Diverts organics from landfill methane." },
        { title: "Freeze leftovers", why: "Extends shelf life dramatically." },
      ],
      tips: ["Check fridge before shopping", "Use FIFO storage", "Love ugly produce"],
      category: "Food",
    },
  },
  {
    keywords: ["flying environmentally", "is flying green", "airplane sustainable"],
    question: "Is flying environmentally friendly?",
    data: {
      answer:
        "Flying is among the most carbon-intensive activities per hour. A single long-haul flight can exceed a year of driving emissions.",
      scores: { overall: 20, environmental: 12, economic: 35, social: 50 },
      alternatives: [
        { title: "Train", why: "Up to 90% less CO₂ for equivalent distance." },
        { title: "Video meetings", why: "Zero-carbon substitute for business travel." },
        { title: "Fewer, longer trips", why: "Reduces total flight count." },
      ],
      tips: ["Fly economy (more passengers per flight)", "Direct flights beat layovers", "Offset unavoidable flights"],
      category: "Transport",
    },
  },
  {
    keywords: ["driving school", "drive to school"],
    question: "Is driving to school sustainable?",
    data: {
      answer:
        "Solo driving short distances is one of the least efficient uses of a car. Carpooling, cycling, or walking dramatically improve the footprint.",
      scores: { overall: 35, environmental: 25, economic: 40, social: 60 },
      alternatives: [
        { title: "Carpool", why: "Splits emissions across passengers." },
        { title: "Cycle", why: "Zero emissions and healthy." },
        { title: "School bus", why: "Removes many single cars from the road." },
      ],
      tips: ["Organize a walking bus", "Bike-safe routes", "Combine with parent trips"],
      category: "Transport",
    },
  },
  {
    keywords: ["shorter shower", "shower time water"],
    question: "Do shorter showers save water?",
    data: {
      answer:
        "Yes. Cutting a shower from 10 to 5 minutes saves ~50 liters and the energy to heat it.",
      scores: { overall: 88, environmental: 90, economic: 90, social: 82 },
      alternatives: [
        { title: "Low-flow showerhead", why: "Cuts flow ~50% with no effort." },
        { title: "Navy shower", why: "Water off while soaping." },
      ],
      tips: ["Use a timer", "Turn off while shampooing", "Collect cold startup water for plants"],
      category: "Water",
    },
  },
  {
    keywords: ["vegetarian sustainable", "meat sustainable", "eat less meat"],
    question: "Is eating less meat sustainable?",
    data: {
      answer:
        "Yes. Reducing red meat is one of the highest-impact personal actions — beef alone accounts for a large share of food-related emissions.",
      scores: { overall: 90, environmental: 94, economic: 85, social: 82 },
      alternatives: [
        { title: "Plant-based days", why: "Meatless Mondays cut ~15% of meat impact." },
        { title: "Chicken/fish over beef", why: "Much lower footprint per kg." },
        { title: "Legumes", why: "High protein, low impact." },
      ],
      tips: ["Try lentils and beans", "Batch cook plant meals", "Buy local when possible"],
      category: "Food",
    },
  },
  {
    keywords: ["fast fashion", "cheap clothes"],
    question: "Is fast fashion bad for the environment?",
    data: {
      answer:
        "Yes. Fast fashion drives huge water use, microplastic pollution, and textile waste. Longer-lasting clothing is far more sustainable.",
      scores: { overall: 25, environmental: 18, economic: 45, social: 30 },
      alternatives: [
        { title: "Second-hand", why: "Zero new production impact." },
        { title: "Quality basics", why: "Fewer items, longer life." },
        { title: "Repair & mend", why: "Extends garment life 2×." },
      ],
      tips: ["Buy fewer, better pieces", "Wash cold, air dry", "Donate or resell"],
      category: "Consumption",
    },
  },
  {
    keywords: ["paper straw plastic straw"],
    question: "Are paper straws better than plastic?",
    data: {
      answer:
        "Paper straws are better than single-use plastic but reusable is best. Skipping straws entirely is the top option.",
      scores: { overall: 65, environmental: 70, economic: 60, social: 65 },
      alternatives: [
        { title: "No straw", why: "Zero impact." },
        { title: "Stainless steel straw", why: "Lifetime reuse." },
        { title: "Silicone straw", why: "Kid-friendly reusable option." },
      ],
      tips: ["Carry a reusable straw", "Refuse at restaurants", "Wash after each use"],
      category: "Consumption",
    },
  },
  {
    keywords: ["solar panel worth", "install solar"],
    question: "Are solar panels worth it?",
    data: {
      answer:
        "In most sunny regions, rooftop solar pays back within 5–10 years and delivers 20+ years of clean energy.",
      scores: { overall: 92, environmental: 96, economic: 85, social: 88 },
      alternatives: [
        { title: "Community solar", why: "For those who can't install." },
        { title: "Green energy tariff", why: "Switch supplier without installation." },
      ],
      tips: ["Check roof orientation", "Combine with battery", "Use excess for EV charging"],
      category: "Energy",
    },
  },
  {
    keywords: ["reusable coffee cup", "coffee cup"],
    question: "Do reusable coffee cups help?",
    data: {
      answer:
        "Yes, after ~20 uses a reusable cup beats disposables. Many cafes also offer discounts.",
      scores: { overall: 82, environmental: 85, economic: 80, social: 78 },
      alternatives: [
        { title: "Drink in ceramic", why: "Zero disposables at all." },
        { title: "Bamboo cup", why: "Biodegradable end-of-life." },
      ],
      tips: ["Keep one in your bag", "Ask for a discount", "Wash daily"],
      category: "Consumption",
    },
  },
  {
    keywords: ["compost apartment", "small space compost"],
    question: "Can I compost in an apartment?",
    data: {
      answer:
        "Yes. Bokashi bins and small worm farms handle food scraps indoors with no smell.",
      scores: { overall: 85, environmental: 90, economic: 78, social: 80 },
      alternatives: [
        { title: "Community compost", why: "Drop-off at farmers markets." },
        { title: "Curbside organics", why: "If your city offers it." },
      ],
      tips: ["Freeze scraps between drops", "Balance greens/browns", "Avoid oily foods"],
      category: "Composting",
    },
  },
  {
    keywords: ["thermostat heating"],
    question: "Does lowering the thermostat save energy?",
    data: {
      answer:
        "Yes. Every 1°C lower cuts heating energy by about 6–10%.",
      scores: { overall: 88, environmental: 90, economic: 92, social: 80 },
      alternatives: [
        { title: "Smart thermostat", why: "Automates efficient schedules." },
        { title: "Better insulation", why: "Long-term structural savings." },
      ],
      tips: ["Wear a sweater indoors", "Set 18–20°C max", "Zone-heat rooms in use"],
      category: "Energy",
    },
  },
  {
    keywords: ["ldip battery recycle", "battery recycle"],
    question: "Should I recycle batteries?",
    data: {
      answer:
        "Yes. Batteries contain heavy metals that leach in landfill. Most electronics stores take them back.",
      scores: { overall: 90, environmental: 94, economic: 80, social: 88 },
      alternatives: [
        { title: "Rechargeable batteries", why: "Reduce disposal volume drastically." },
        { title: "USB devices", why: "Skip disposable cells altogether." },
      ],
      tips: ["Store used batteries safely", "Never bin them", "Use dedicated collection points"],
      category: "Recycling",
    },
  },
  {
    keywords: ["local produce", "buy local food"],
    question: "Is buying local produce more sustainable?",
    data: {
      answer:
        "Often yes — shorter transport, fresher food, supports local economy. Seasonal + local beats imported organic.",
      scores: { overall: 84, environmental: 82, economic: 88, social: 90 },
      alternatives: [
        { title: "Farmers market", why: "Direct-to-farmer, minimal packaging." },
        { title: "Grow your own", why: "Zero transport, full control." },
      ],
      tips: ["Eat seasonal", "Join a CSA box", "Skip out-of-season imports"],
      category: "Food",
    },
  },
  {
    keywords: ["paper vs digital", "print paper"],
    question: "Is going paperless more sustainable?",
    data: {
      answer:
        "Generally yes for high-volume documents. Digital storage still uses energy, but far less than paper production.",
      scores: { overall: 78, environmental: 80, economic: 85, social: 70 },
      alternatives: [
        { title: "Recycled paper", why: "Best when print is unavoidable." },
        { title: "Double-sided printing", why: "Halves paper use." },
      ],
      tips: ["Cancel paper mail", "Use e-signatures", "Print only when needed"],
      category: "Consumption",
    },
  },
  {
    keywords: ["rainwater harvest"],
    question: "Should I harvest rainwater?",
    data: {
      answer:
        "Yes. Rainwater for gardens, toilets, or washing reduces treated-water demand significantly.",
      scores: { overall: 86, environmental: 90, economic: 80, social: 82 },
      alternatives: [
        { title: "Greywater reuse", why: "Reuses shower/sink water." },
        { title: "Drought-tolerant garden", why: "Reduces need altogether." },
      ],
      tips: ["Install a rain barrel", "Cover to prevent mosquitoes", "Use first for outdoor tasks"],
      category: "Water",
    },
  },
  {
    keywords: ["bamboo toothbrush"],
    question: "Are bamboo toothbrushes better?",
    data: {
      answer:
        "Yes. Bamboo handles biodegrade unlike plastic. Remove bristles before composting.",
      scores: { overall: 78, environmental: 82, economic: 70, social: 75 },
      alternatives: [
        { title: "Electric brush with replaceable heads", why: "Smaller plastic footprint over time." },
      ],
      tips: ["Compost handle", "Recycle bristles if possible", "Buy in bulk"],
      category: "Consumption",
    },
  },
  {
    keywords: ["air dry clothes", "dryer machine"],
    question: "Is air-drying clothes better than a dryer?",
    data: {
      answer:
        "Yes. Dryers are among the most energy-hungry appliances. Air drying uses zero energy and extends fabric life.",
      scores: { overall: 92, environmental: 96, economic: 94, social: 82 },
      alternatives: [
        { title: "Indoor drying rack", why: "Works in any weather." },
        { title: "Heat-pump dryer", why: "50% less energy if you must use one." },
      ],
      tips: ["Wash cold", "Spin extra to reduce drying time", "Hang in sunlight"],
      category: "Energy",
    },
  },
  {
    keywords: ["second hand clothes thrift"],
    question: "Is buying second-hand sustainable?",
    data: {
      answer:
        "Very. Second-hand items skip all new-production impact and extend product life.",
      scores: { overall: 94, environmental: 96, economic: 92, social: 90 },
      alternatives: [
        { title: "Clothing swaps", why: "Free and social." },
        { title: "Rental", why: "For rarely-worn formal wear." },
      ],
      tips: ["Check thrift stores first", "Sell what you don't use", "Repair before replacing"],
      category: "Consumption",
    },
  },
  {
    keywords: ["standby appliances vampire"],
    question: "Do appliances on standby waste energy?",
    data: {
      answer:
        "Yes. Standby power can be 5–10% of a household's electricity bill.",
      scores: { overall: 84, environmental: 86, economic: 90, social: 78 },
      alternatives: [
        { title: "Smart power strips", why: "Cut phantom loads automatically." },
        { title: "Unplug chargers", why: "Even idle chargers draw power." },
      ],
      tips: ["Use one master switch", "Unplug TV/consoles overnight", "Audit with a power meter"],
      category: "Energy",
    },
  },
  {
    keywords: ["ebook vs paper book"],
    question: "Is reading e-books more sustainable than paper?",
    data: {
      answer:
        "After ~25 books, an e-reader beats new paper. Library books remain the greenest choice.",
      scores: { overall: 76, environmental: 78, economic: 80, social: 72 },
      alternatives: [
        { title: "Library", why: "Zero new production." },
        { title: "Used books", why: "Extend life of existing stock." },
      ],
      tips: ["Keep e-reader long-term", "Recycle old paper books", "Share within communities"],
      category: "Consumption",
    },
  },
  {
    keywords: ["kitchen towel paper towel"],
    question: "Should I switch from paper towels to cloth?",
    data: {
      answer:
        "Yes. Reusable cloths eliminate a huge stream of household paper waste.",
      scores: { overall: 86, environmental: 90, economic: 88, social: 80 },
      alternatives: [
        { title: "Bamboo reusable towels", why: "Washable up to 100 times." },
        { title: "Old T-shirts as rags", why: "Zero cost, reuses waste." },
      ],
      tips: ["Keep a stack in the kitchen", "Wash in cold", "Compost paper-based ones"],
      category: "Consumption",
    },
  },
  {
    keywords: ["led light bulb"],
    question: "Should I switch to LED bulbs?",
    data: {
      answer:
        "Yes. LEDs use up to 80% less energy and last 15–25× longer than incandescent bulbs.",
      scores: { overall: 94, environmental: 96, economic: 96, social: 85 },
      alternatives: [
        { title: "Smart LEDs", why: "Add scheduling and dimming." },
        { title: "Daylight design", why: "Maximize natural light first." },
      ],
      tips: ["Replace bulbs as they die", "Choose warm color", "Recycle old CFLs properly"],
      category: "Energy",
    },
  },
];

export function findOffline(question: string): OfflineEntry | null {
  const q = question.toLowerCase();
  let best: OfflineEntry | null = null;
  let bestScore = 0;
  for (const entry of OFFLINE_KB) {
    for (const kw of entry.keywords) {
      const parts = kw.toLowerCase().split(" ");
      const hits = parts.filter((p) => q.includes(p)).length;
      const score = hits / parts.length;
      if (score > bestScore && score >= 0.6) {
        bestScore = score;
        best = entry;
      }
    }
  }
  return best;
}
