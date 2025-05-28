export interface Country {
  code: string; // ISO 3166-1 alpha-2 code (e.g., "us", "gb")
  name: string; // English name (e.g., "United States", "United Kingdom")
  region: string; // Geographic region (e.g., "Europe", "Asia")
  subregion?: string; // More specific subregion (optional)
}

// Helper function to get flag emoji from country code
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Countries with their ISO codes and region information
export const countries: Country[] = [
  // Europe
  {
    code: "al",
    name: "Albania",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "ad",
    name: "Andorra",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "at",
    name: "Austria",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "by",
    name: "Belarus",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "be",
    name: "Belgium",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "ba",
    name: "Bosnia and Herzegovina",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "bg",
    name: "Bulgaria",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "hr",
    name: "Croatia",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "cy",
    name: "Cyprus",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "cz",
    name: "Czech Republic",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "dk",
    name: "Denmark",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "ee",
    name: "Estonia",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "fi",
    name: "Finland",
    region: "Europe",
    subregion: "Northern Europe",
  },
  { code: "fr", name: "France", region: "Europe", subregion: "Western Europe" },
  {
    code: "de",
    name: "Germany",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "gr",
    name: "Greece",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "hu",
    name: "Hungary",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "is",
    name: "Iceland",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "ie",
    name: "Ireland",
    region: "Europe",
    subregion: "Northern Europe",
  },
  { code: "it", name: "Italy", region: "Europe", subregion: "Southern Europe" },
  {
    code: "lv",
    name: "Latvia",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "li",
    name: "Liechtenstein",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "lt",
    name: "Lithuania",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "lu",
    name: "Luxembourg",
    region: "Europe",
    subregion: "Western Europe",
  },
  { code: "mt", name: "Malta", region: "Europe", subregion: "Southern Europe" },
  {
    code: "md",
    name: "Moldova",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  { code: "mc", name: "Monaco", region: "Europe", subregion: "Western Europe" },
  {
    code: "me",
    name: "Montenegro",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "nl",
    name: "Netherlands",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "mk",
    name: "North Macedonia",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "no",
    name: "Norway",
    region: "Europe",
    subregion: "Northern Europe",
  },
  { code: "pl", name: "Poland", region: "Europe", subregion: "Eastern Europe" },
  {
    code: "pt",
    name: "Portugal",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "ro",
    name: "Romania",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  { code: "ru", name: "Russia", region: "Europe", subregion: "Eastern Europe" },
  {
    code: "sm",
    name: "San Marino",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "rs",
    name: "Serbia",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "sk",
    name: "Slovakia",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "si",
    name: "Slovenia",
    region: "Europe",
    subregion: "Southern Europe",
  },
  { code: "es", name: "Spain", region: "Europe", subregion: "Southern Europe" },
  {
    code: "se",
    name: "Sweden",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "ch",
    name: "Switzerland",
    region: "Europe",
    subregion: "Western Europe",
  },
  {
    code: "tr",
    name: "Turkey",
    region: "Europe",
    subregion: "Southern Europe",
  },
  {
    code: "ua",
    name: "Ukraine",
    region: "Europe",
    subregion: "Eastern Europe",
  },
  {
    code: "gb",
    name: "United Kingdom",
    region: "Europe",
    subregion: "Northern Europe",
  },
  {
    code: "va",
    name: "Vatican City",
    region: "Europe",
    subregion: "Southern Europe",
  },

  // Asia
  {
    code: "af",
    name: "Afghanistan",
    region: "Asia",
    subregion: "Southern Asia",
  },
  { code: "am", name: "Armenia", region: "Asia", subregion: "Western Asia" },
  { code: "az", name: "Azerbaijan", region: "Asia", subregion: "Western Asia" },
  { code: "bh", name: "Bahrain", region: "Asia", subregion: "Western Asia" },
  {
    code: "bd",
    name: "Bangladesh",
    region: "Asia",
    subregion: "Southern Asia",
  },
  { code: "bt", name: "Bhutan", region: "Asia", subregion: "Southern Asia" },
  {
    code: "bn",
    name: "Brunei",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  {
    code: "kh",
    name: "Cambodia",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "cn", name: "China", region: "Asia", subregion: "Eastern Asia" },
  { code: "ge", name: "Georgia", region: "Asia", subregion: "Western Asia" },
  { code: "in", name: "India", region: "Asia", subregion: "Southern Asia" },
  {
    code: "id",
    name: "Indonesia",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "ir", name: "Iran", region: "Asia", subregion: "Southern Asia" },
  { code: "iq", name: "Iraq", region: "Asia", subregion: "Western Asia" },
  { code: "il", name: "Israel", region: "Asia", subregion: "Western Asia" },
  { code: "jp", name: "Japan", region: "Asia", subregion: "Eastern Asia" },
  { code: "jo", name: "Jordan", region: "Asia", subregion: "Western Asia" },
  { code: "kz", name: "Kazakhstan", region: "Asia", subregion: "Central Asia" },
  {
    code: "kp",
    name: "North Korea",
    region: "Asia",
    subregion: "Eastern Asia",
  },
  {
    code: "kr",
    name: "South Korea",
    region: "Asia",
    subregion: "Eastern Asia",
  },
  { code: "kw", name: "Kuwait", region: "Asia", subregion: "Western Asia" },
  { code: "kg", name: "Kyrgyzstan", region: "Asia", subregion: "Central Asia" },
  { code: "la", name: "Laos", region: "Asia", subregion: "South-Eastern Asia" },
  { code: "lb", name: "Lebanon", region: "Asia", subregion: "Western Asia" },
  {
    code: "my",
    name: "Malaysia",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "mv", name: "Maldives", region: "Asia", subregion: "Southern Asia" },
  { code: "mn", name: "Mongolia", region: "Asia", subregion: "Eastern Asia" },
  {
    code: "mm",
    name: "Myanmar",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "np", name: "Nepal", region: "Asia", subregion: "Southern Asia" },
  { code: "om", name: "Oman", region: "Asia", subregion: "Western Asia" },
  { code: "pk", name: "Pakistan", region: "Asia", subregion: "Southern Asia" },
  {
    code: "ph",
    name: "Philippines",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "qa", name: "Qatar", region: "Asia", subregion: "Western Asia" },
  {
    code: "sa",
    name: "Saudi Arabia",
    region: "Asia",
    subregion: "Western Asia",
  },
  {
    code: "sg",
    name: "Singapore",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "lk", name: "Sri Lanka", region: "Asia", subregion: "Southern Asia" },
  { code: "sy", name: "Syria", region: "Asia", subregion: "Western Asia" },
  { code: "tw", name: "Taiwan", region: "Asia", subregion: "Eastern Asia" },
  { code: "tj", name: "Tajikistan", region: "Asia", subregion: "Central Asia" },
  {
    code: "th",
    name: "Thailand",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  {
    code: "tl",
    name: "Timor-Leste",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  {
    code: "tm",
    name: "Turkmenistan",
    region: "Asia",
    subregion: "Central Asia",
  },
  {
    code: "ae",
    name: "United Arab Emirates",
    region: "Asia",
    subregion: "Western Asia",
  },
  { code: "uz", name: "Uzbekistan", region: "Asia", subregion: "Central Asia" },
  {
    code: "vn",
    name: "Vietnam",
    region: "Asia",
    subregion: "South-Eastern Asia",
  },
  { code: "ye", name: "Yemen", region: "Asia", subregion: "Western Asia" },

  // Africa
  {
    code: "dz",
    name: "Algeria",
    region: "Africa",
    subregion: "Northern Africa",
  },
  { code: "ao", name: "Angola", region: "Africa", subregion: "Middle Africa" },
  { code: "bj", name: "Benin", region: "Africa", subregion: "Western Africa" },
  {
    code: "bw",
    name: "Botswana",
    region: "Africa",
    subregion: "Southern Africa",
  },
  {
    code: "bf",
    name: "Burkina Faso",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "bi",
    name: "Burundi",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "cv",
    name: "Cabo Verde",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "cm",
    name: "Cameroon",
    region: "Africa",
    subregion: "Middle Africa",
  },
  {
    code: "cf",
    name: "Central African Republic",
    region: "Africa",
    subregion: "Middle Africa",
  },
  { code: "td", name: "Chad", region: "Africa", subregion: "Middle Africa" },
  {
    code: "km",
    name: "Comoros",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "cg", name: "Congo", region: "Africa", subregion: "Middle Africa" },
  {
    code: "cd",
    name: "DR Congo",
    region: "Africa",
    subregion: "Middle Africa",
  },
  {
    code: "dj",
    name: "Djibouti",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "eg", name: "Egypt", region: "Africa", subregion: "Northern Africa" },
  {
    code: "gq",
    name: "Equatorial Guinea",
    region: "Africa",
    subregion: "Middle Africa",
  },
  {
    code: "er",
    name: "Eritrea",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "sz",
    name: "Eswatini",
    region: "Africa",
    subregion: "Southern Africa",
  },
  {
    code: "et",
    name: "Ethiopia",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "ga", name: "Gabon", region: "Africa", subregion: "Middle Africa" },
  { code: "gm", name: "Gambia", region: "Africa", subregion: "Western Africa" },
  { code: "gh", name: "Ghana", region: "Africa", subregion: "Western Africa" },
  { code: "gn", name: "Guinea", region: "Africa", subregion: "Western Africa" },
  {
    code: "gw",
    name: "Guinea-Bissau",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "ci",
    name: "Côte d'Ivoire",
    region: "Africa",
    subregion: "Western Africa",
  },
  { code: "ke", name: "Kenya", region: "Africa", subregion: "Eastern Africa" },
  {
    code: "ls",
    name: "Lesotho",
    region: "Africa",
    subregion: "Southern Africa",
  },
  {
    code: "lr",
    name: "Liberia",
    region: "Africa",
    subregion: "Western Africa",
  },
  { code: "ly", name: "Libya", region: "Africa", subregion: "Northern Africa" },
  {
    code: "mg",
    name: "Madagascar",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "mw", name: "Malawi", region: "Africa", subregion: "Eastern Africa" },
  { code: "ml", name: "Mali", region: "Africa", subregion: "Western Africa" },
  {
    code: "mr",
    name: "Mauritania",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "mu",
    name: "Mauritius",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "ma",
    name: "Morocco",
    region: "Africa",
    subregion: "Northern Africa",
  },
  {
    code: "mz",
    name: "Mozambique",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "na",
    name: "Namibia",
    region: "Africa",
    subregion: "Southern Africa",
  },
  { code: "ne", name: "Niger", region: "Africa", subregion: "Western Africa" },
  {
    code: "ng",
    name: "Nigeria",
    region: "Africa",
    subregion: "Western Africa",
  },
  { code: "rw", name: "Rwanda", region: "Africa", subregion: "Eastern Africa" },
  {
    code: "st",
    name: "São Tomé and Príncipe",
    region: "Africa",
    subregion: "Middle Africa",
  },
  {
    code: "sn",
    name: "Senegal",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "sc",
    name: "Seychelles",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "sl",
    name: "Sierra Leone",
    region: "Africa",
    subregion: "Western Africa",
  },
  {
    code: "so",
    name: "Somalia",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  {
    code: "za",
    name: "South Africa",
    region: "Africa",
    subregion: "Southern Africa",
  },
  {
    code: "ss",
    name: "South Sudan",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "sd", name: "Sudan", region: "Africa", subregion: "Northern Africa" },
  {
    code: "tz",
    name: "Tanzania",
    region: "Africa",
    subregion: "Eastern Africa",
  },
  { code: "tg", name: "Togo", region: "Africa", subregion: "Western Africa" },
  {
    code: "tn",
    name: "Tunisia",
    region: "Africa",
    subregion: "Northern Africa",
  },
  { code: "ug", name: "Uganda", region: "Africa", subregion: "Eastern Africa" },
  { code: "zm", name: "Zambia", region: "Africa", subregion: "Eastern Africa" },
  {
    code: "zw",
    name: "Zimbabwe",
    region: "Africa",
    subregion: "Eastern Africa",
  },

  // Americas
  {
    code: "ag",
    name: "Antigua and Barbuda",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "ar",
    name: "Argentina",
    region: "Americas",
    subregion: "South America",
  },
  { code: "bs", name: "Bahamas", region: "Americas", subregion: "Caribbean" },
  { code: "bb", name: "Barbados", region: "Americas", subregion: "Caribbean" },
  {
    code: "bz",
    name: "Belize",
    region: "Americas",
    subregion: "Central America",
  },
  {
    code: "bo",
    name: "Bolivia",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "br",
    name: "Brazil",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "ca",
    name: "Canada",
    region: "Americas",
    subregion: "North America",
  },
  { code: "cl", name: "Chile", region: "Americas", subregion: "South America" },
  {
    code: "co",
    name: "Colombia",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "cr",
    name: "Costa Rica",
    region: "Americas",
    subregion: "Central America",
  },
  { code: "cu", name: "Cuba", region: "Americas", subregion: "Caribbean" },
  { code: "dm", name: "Dominica", region: "Americas", subregion: "Caribbean" },
  {
    code: "do",
    name: "Dominican Republic",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "ec",
    name: "Ecuador",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "sv",
    name: "El Salvador",
    region: "Americas",
    subregion: "Central America",
  },
  { code: "gd", name: "Grenada", region: "Americas", subregion: "Caribbean" },
  {
    code: "gt",
    name: "Guatemala",
    region: "Americas",
    subregion: "Central America",
  },
  {
    code: "gy",
    name: "Guyana",
    region: "Americas",
    subregion: "South America",
  },
  { code: "ht", name: "Haiti", region: "Americas", subregion: "Caribbean" },
  {
    code: "hn",
    name: "Honduras",
    region: "Americas",
    subregion: "Central America",
  },
  { code: "jm", name: "Jamaica", region: "Americas", subregion: "Caribbean" },
  {
    code: "mx",
    name: "Mexico",
    region: "Americas",
    subregion: "North America",
  },
  {
    code: "ni",
    name: "Nicaragua",
    region: "Americas",
    subregion: "Central America",
  },
  {
    code: "pa",
    name: "Panama",
    region: "Americas",
    subregion: "Central America",
  },
  {
    code: "py",
    name: "Paraguay",
    region: "Americas",
    subregion: "South America",
  },
  { code: "pe", name: "Peru", region: "Americas", subregion: "South America" },
  {
    code: "kn",
    name: "Saint Kitts and Nevis",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "lc",
    name: "Saint Lucia",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "vc",
    name: "Saint Vincent and the Grenadines",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "sr",
    name: "Suriname",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "tt",
    name: "Trinidad and Tobago",
    region: "Americas",
    subregion: "Caribbean",
  },
  {
    code: "us",
    name: "United States",
    region: "Americas",
    subregion: "North America",
  },
  {
    code: "uy",
    name: "Uruguay",
    region: "Americas",
    subregion: "South America",
  },
  {
    code: "ve",
    name: "Venezuela",
    region: "Americas",
    subregion: "South America",
  },

  // Oceania
  {
    code: "au",
    name: "Australia",
    region: "Oceania",
    subregion: "Australia and New Zealand",
  },
  { code: "fj", name: "Fiji", region: "Oceania", subregion: "Melanesia" },
  { code: "ki", name: "Kiribati", region: "Oceania", subregion: "Micronesia" },
  {
    code: "mh",
    name: "Marshall Islands",
    region: "Oceania",
    subregion: "Micronesia",
  },
  {
    code: "fm",
    name: "Micronesia",
    region: "Oceania",
    subregion: "Micronesia",
  },
  { code: "nr", name: "Nauru", region: "Oceania", subregion: "Micronesia" },
  {
    code: "nz",
    name: "New Zealand",
    region: "Oceania",
    subregion: "Australia and New Zealand",
  },
  { code: "pw", name: "Palau", region: "Oceania", subregion: "Micronesia" },
  {
    code: "pg",
    name: "Papua New Guinea",
    region: "Oceania",
    subregion: "Melanesia",
  },
  { code: "ws", name: "Samoa", region: "Oceania", subregion: "Polynesia" },
  {
    code: "sb",
    name: "Solomon Islands",
    region: "Oceania",
    subregion: "Melanesia",
  },
  { code: "to", name: "Tonga", region: "Oceania", subregion: "Polynesia" },
  { code: "tv", name: "Tuvalu", region: "Oceania", subregion: "Polynesia" },
  { code: "vu", name: "Vanuatu", region: "Oceania", subregion: "Melanesia" },
];

// Helper function to group countries by region
export function getCountriesByRegion(): Record<string, Country[]> {
  const regions: Record<string, Country[]> = {};

  countries.forEach((country) => {
    if (!regions[country.region]) {
      regions[country.region] = [];
    }
    regions[country.region].push(country);
  });

  // Sort countries within each region by name
  Object.keys(regions).forEach((region) => {
    regions[region].sort((a, b) => a.name.localeCompare(b.name));
  });

  return regions;
}

// Helper function to search countries
export function searchCountries(query: string): Country[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return countries.filter(
    (country) =>
      country.code.toLowerCase().includes(searchTerm) ||
      country.name.toLowerCase().includes(searchTerm) ||
      country.region.toLowerCase().includes(searchTerm) ||
      (country.subregion &&
        country.subregion.toLowerCase().includes(searchTerm)),
  );
}
