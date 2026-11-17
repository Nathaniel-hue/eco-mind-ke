export type GlobeEvent = {
  id: string;
  kind: "good" | "bad";
  country: string;
  lat: number;
  lng: number;
  title: string;
  summary: string;
  cause?: string;
  source: string;
  url: string;
};

export const GLOBE_EVENTS: GlobeEvent[] = [
  { id: "ke-renewables", kind: "good", country: "Kenya", lat: -0.5, lng: 36.5, title: "Around 90% of electricity from renewables", summary: "Geothermal in the Rift Valley, hydro and wind power supply most of Kenya's grid.", source: "IEA", url: "https://www.iea.org/countries/kenya" },
  { id: "ke-bags", kind: "good", country: "Kenya", lat: -1.3, lng: 36.8, title: "Plastic bag ban (2017)", summary: "One of the world's strictest bans on single-use plastic carrier bags.", source: "UNEP", url: "https://www.unep.org/news-and-stories/story/kenya-plastic-bag-ban" },
  { id: "cr-forest", kind: "good", country: "Costa Rica", lat: 9.9, lng: -84.1, title: "Forest cover restored to over half the country", summary: "Payments for ecosystem services helped reverse decades of deforestation.", source: "UNEP", url: "https://www.unep.org/news-and-stories/story/costa-rica-champion-forest-restoration" },
  { id: "dk-wind", kind: "good", country: "Denmark", lat: 56, lng: 10, title: "Wind supplies about half of electricity", summary: "A world leader in wind power share and offshore wind development.", source: "IEA", url: "https://www.iea.org/countries/denmark" },
  { id: "bt-negative", kind: "good", country: "Bhutan", lat: 27.5, lng: 90.4, title: "Carbon-negative country", summary: "Forests absorb more carbon than the country emits; forest protection is in the constitution.", source: "UNFCCC", url: "https://unfccc.int/news/bhutan-is-carbon-negative" },
  { id: "rw-plastic", kind: "good", country: "Rwanda", lat: -1.9, lng: 29.9, title: "Early plastic ban and clean streets", summary: "Rwanda banned plastic bags in 2008 and later single-use plastics.", source: "UNEP", url: "https://www.unep.org/news-and-stories/story/rwanda-leads-way-plastic-pollution" },
  { id: "cn-solar", kind: "good", country: "China", lat: 37, lng: 104, title: "World's largest solar and wind build-out", summary: "China installs more solar capacity each year than the rest of the world combined.", source: "IEA", url: "https://www.iea.org/reports/renewables-2024" },
  { id: "pt-renew", kind: "good", country: "Portugal", lat: 39.5, lng: -8, title: "Days running on 100% renewables", summary: "Portugal's grid has run entirely on renewable power for multiple consecutive days.", source: "IEA", url: "https://www.iea.org/countries/portugal" },
  { id: "ng-wall", kind: "good", country: "Senegal to Ethiopia", lat: 14, lng: 0, title: "Great Green Wall", summary: "An African-led effort to restore degraded land across the Sahel.", source: "UNCCD", url: "https://www.unccd.int/our-work/ggwi" },
  { id: "ozone", kind: "good", country: "Antarctica", lat: -78, lng: 0, title: "Ozone layer on track to recover", summary: "The Montreal Protocol phased out ozone-depleting chemicals worldwide.", source: "UNEP", url: "https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol" },
  { id: "au-gbr", kind: "bad", country: "Australia", lat: -18.3, lng: 147.7, title: "Mass coral bleaching on the Great Barrier Reef", summary: "Repeated marine heatwaves have bleached large areas of the reef.", cause: "Ocean warming from greenhouse gas emissions", source: "AIMS", url: "https://www.aims.gov.au/research-topics/environmental-issues/coral-bleaching" },
  { id: "br-amazon", kind: "bad", country: "Brazil", lat: -5, lng: -60, title: "Amazon deforestation", summary: "Large areas of rainforest are cleared each year, though rates have fallen recently.", cause: "Cattle ranching, soy farming, illegal logging", source: "Global Forest Watch", url: "https://www.globalforestwatch.org/dashboards/country/BRA/" },
  { id: "id-palm", kind: "bad", country: "Indonesia", lat: -0.8, lng: 113.9, title: "Peatland and rainforest loss", summary: "Forest clearing and peat fires release huge amounts of carbon.", cause: "Palm oil, pulpwood and mining expansion", source: "Global Forest Watch", url: "https://www.globalforestwatch.org/dashboards/country/IDN/" },
  { id: "in-air", kind: "bad", country: "India", lat: 28.6, lng: 77.2, title: "Severe urban air pollution", summary: "Delhi and other northern cities regularly reach hazardous air quality.", cause: "Vehicles, coal power, crop burning, industry", source: "WHO", url: "https://www.who.int/india/health-topics/air-pollution" },
  { id: "us-emit", kind: "bad", country: "United States", lat: 39, lng: -98, title: "Highest historical CO₂ emissions", summary: "The largest cumulative contributor to carbon dioxide in the atmosphere.", cause: "Fossil fuels for transport, power and industry", source: "Our World in Data", url: "https://ourworldindata.org/co2/country/united-states" },
  { id: "cn-coal", kind: "bad", country: "China", lat: 31, lng: 115, title: "World's largest annual emitter", summary: "Coal still dominates power generation despite rapid renewable growth.", cause: "Coal power and heavy industry", source: "Our World in Data", url: "https://ourworldindata.org/co2/country/china" },
  { id: "pacific", kind: "bad", country: "Pacific Ocean", lat: 32, lng: -145, title: "Great Pacific Garbage Patch", summary: "A vast area where floating plastic debris accumulates.", cause: "Plastic waste and fishing gear from many countries", source: "NOAA", url: "https://marinedebris.noaa.gov/info/patch.html" },
  { id: "kz-aral", kind: "bad", country: "Kazakhstan / Uzbekistan", lat: 45, lng: 60, title: "Shrinking Aral Sea", summary: "Once one of the largest lakes on Earth, now mostly desert.", cause: "River diversion for cotton irrigation", source: "NASA Earth Observatory", url: "https://earthobservatory.nasa.gov/world-of-change/AralSea" },
  { id: "ng-oil", kind: "bad", country: "Nigeria", lat: 5, lng: 6.5, title: "Niger Delta oil spills", summary: "Decades of spills have polluted land, rivers and mangroves.", cause: "Oil pipelines, theft and poor maintenance", source: "UNEP", url: "https://www.unep.org/topics/disasters-and-conflicts/country-presence/nigeria/environmental-assessment-ogoniland-report" },
  { id: "ca-fires", kind: "bad", country: "Canada", lat: 56, lng: -110, title: "Record wildfire seasons", summary: "Wildfires have burned unprecedented areas in recent years.", cause: "Hotter, drier conditions linked to climate change", source: "Natural Resources Canada", url: "https://natural-resources.canada.ca/climate-change/climate-change-impacts-forests/forest-fires" },
  { id: "gh-ewaste", kind: "bad", country: "Ghana", lat: 5.6, lng: -0.2, title: "E-waste dumping at Agbogbloshie", summary: "Imported electronics are burned to recover metals, releasing toxins.", cause: "Exported e-waste from wealthier countries", source: "WHO", url: "https://www.who.int/news-room/fact-sheets/detail/electronic-waste-(e-waste)" },
  { id: "ke-drought", kind: "bad", country: "Horn of Africa", lat: 3, lng: 40, title: "Record multi-season drought", summary: "Failed rainy seasons hit herders and farmers in Kenya, Somalia and Ethiopia.", cause: "Climate change made the drought far more likely", source: "World Weather Attribution", url: "https://www.worldweatherattribution.org/human-induced-climate-change-increased-drought-severity-in-southern-horn-of-africa/" },
];
