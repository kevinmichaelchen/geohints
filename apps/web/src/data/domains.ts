/**
 * Country-code top-level domain (ccTLD) data for GeoGuessr
 * Helps players identify countries from visible URLs in street view
 */

import { getContinents, type CountryMeta } from "./country-meta";

/** GeoGuessr frequency - how often this domain appears in street view */
export type DomainFrequency = "common" | "uncommon" | "rare";

/** Feature-specific data for domains */
interface DomainData {
  /** The ccTLD extension without the dot (e.g., "de", "jp") */
  tld: string;
  /** Mnemonic or note for non-obvious domain mappings */
  mnemonic?: string;
  /** How often this domain appears in GeoGuessr street view */
  frequency: DomainFrequency;
  /** Special notes about the domain */
  note?: string;
}

/** Domain entry with full country metadata */
export interface DomainEntry extends CountryMeta, DomainData {}

/**
 * Comprehensive ccTLD data
 * Sources: IANA ccTLD list + GeoGuessr coverage knowledge
 */
const domainData: Record<string, DomainData> = {
  // Africa
  DZ: { tld: "dz", frequency: "rare" },
  AO: { tld: "ao", frequency: "rare" },
  BJ: { tld: "bj", frequency: "rare" },
  BW: { tld: "bw", frequency: "uncommon" },
  BF: { tld: "bf", frequency: "rare" },
  BI: { tld: "bi", frequency: "rare" },
  CM: { tld: "cm", frequency: "rare" },
  CV: { tld: "cv", frequency: "rare" },
  CF: { tld: "cf", frequency: "rare" },
  TD: { tld: "td", frequency: "rare" },
  KM: { tld: "km", frequency: "rare" },
  CD: { tld: "cd", frequency: "rare" },
  CG: { tld: "cg", frequency: "rare" },
  CI: { tld: "ci", frequency: "rare", mnemonic: "Cote d'Ivoire" },
  DJ: { tld: "dj", frequency: "rare" },
  EG: { tld: "eg", frequency: "uncommon" },
  GQ: { tld: "gq", frequency: "rare" },
  ER: { tld: "er", frequency: "rare" },
  SZ: { tld: "sz", frequency: "rare", mnemonic: "Swaziland (former name)" },
  ET: { tld: "et", frequency: "rare" },
  GA: { tld: "ga", frequency: "rare" },
  GM: { tld: "gm", frequency: "rare" },
  GH: { tld: "gh", frequency: "uncommon" },
  GN: { tld: "gn", frequency: "rare" },
  GW: { tld: "gw", frequency: "rare" },
  KE: { tld: "ke", frequency: "common" },
  LS: { tld: "ls", frequency: "rare" },
  LR: { tld: "lr", frequency: "rare" },
  LY: { tld: "ly", frequency: "rare", note: "Popular for URL shorteners" },
  MG: { tld: "mg", frequency: "uncommon" },
  MW: { tld: "mw", frequency: "rare" },
  ML: { tld: "ml", frequency: "rare" },
  MR: { tld: "mr", frequency: "rare" },
  MU: { tld: "mu", frequency: "rare" },
  MA: { tld: "ma", frequency: "uncommon" },
  MZ: { tld: "mz", frequency: "rare" },
  NA: { tld: "na", frequency: "rare" },
  NE: { tld: "ne", frequency: "rare" },
  NG: { tld: "ng", frequency: "common" },
  RW: { tld: "rw", frequency: "uncommon" },
  ST: { tld: "st", frequency: "rare" },
  SN: { tld: "sn", frequency: "uncommon" },
  SC: { tld: "sc", frequency: "rare" },
  SL: { tld: "sl", frequency: "rare" },
  SO: { tld: "so", frequency: "rare" },
  ZA: { tld: "za", frequency: "common", mnemonic: "Zuid-Afrika (Dutch)" },
  SS: { tld: "ss", frequency: "rare" },
  SD: { tld: "sd", frequency: "rare" },
  TZ: { tld: "tz", frequency: "uncommon" },
  TG: { tld: "tg", frequency: "rare" },
  TN: { tld: "tn", frequency: "uncommon" },
  UG: { tld: "ug", frequency: "uncommon" },
  ZM: { tld: "zm", frequency: "rare" },
  ZW: { tld: "zw", frequency: "rare" },

  // Asia
  AF: { tld: "af", frequency: "rare" },
  AM: { tld: "am", frequency: "rare" },
  AZ: { tld: "az", frequency: "rare" },
  BH: { tld: "bh", frequency: "rare" },
  BD: { tld: "bd", frequency: "common" },
  BT: { tld: "bt", frequency: "rare" },
  BN: { tld: "bn", frequency: "rare" },
  KH: { tld: "kh", frequency: "common" },
  CN: { tld: "cn", frequency: "rare", note: "China has no Google coverage" },
  GE: { tld: "ge", frequency: "rare" },
  HK: { tld: "hk", frequency: "uncommon" },
  IN: { tld: "in", frequency: "common" },
  ID: { tld: "id", frequency: "common" },
  IR: { tld: "ir", frequency: "rare" },
  IQ: { tld: "iq", frequency: "rare" },
  IL: { tld: "il", frequency: "common" },
  JP: { tld: "jp", frequency: "common" },
  JO: { tld: "jo", frequency: "uncommon" },
  KZ: { tld: "kz", frequency: "rare" },
  KW: { tld: "kw", frequency: "rare" },
  KG: { tld: "kg", frequency: "uncommon" },
  LA: { tld: "la", frequency: "uncommon", note: "Also used for Los Angeles sites" },
  LB: { tld: "lb", frequency: "rare" },
  MO: { tld: "mo", frequency: "rare" },
  MY: { tld: "my", frequency: "common" },
  MV: { tld: "mv", frequency: "rare" },
  MN: { tld: "mn", frequency: "uncommon" },
  MM: { tld: "mm", frequency: "rare" },
  NP: { tld: "np", frequency: "rare" },
  KP: { tld: "kp", frequency: "rare", note: "North Korea - no coverage" },
  OM: { tld: "om", frequency: "rare" },
  PK: { tld: "pk", frequency: "rare" },
  PS: { tld: "ps", frequency: "uncommon" },
  PH: { tld: "ph", frequency: "common" },
  QA: { tld: "qa", frequency: "uncommon" },
  SA: { tld: "sa", frequency: "rare" },
  SG: { tld: "sg", frequency: "common" },
  KR: { tld: "kr", frequency: "common" },
  LK: { tld: "lk", frequency: "common" },
  SY: { tld: "sy", frequency: "rare" },
  TW: { tld: "tw", frequency: "common" },
  TJ: { tld: "tj", frequency: "rare" },
  TH: { tld: "th", frequency: "common" },
  TL: { tld: "tl", frequency: "rare", mnemonic: "Timor-Leste" },
  TR: { tld: "tr", frequency: "common" },
  TM: { tld: "tm", frequency: "rare" },
  AE: { tld: "ae", frequency: "uncommon" },
  UZ: { tld: "uz", frequency: "rare" },
  VN: { tld: "vn", frequency: "common" },
  YE: { tld: "ye", frequency: "rare" },

  // Europe
  AL: { tld: "al", frequency: "uncommon" },
  AD: { tld: "ad", frequency: "uncommon" },
  AT: { tld: "at", frequency: "common" },
  BY: { tld: "by", frequency: "rare" },
  BE: { tld: "be", frequency: "common" },
  BA: { tld: "ba", frequency: "uncommon" },
  BG: { tld: "bg", frequency: "common" },
  HR: { tld: "hr", frequency: "common" },
  CY: { tld: "cy", frequency: "uncommon" },
  CZ: { tld: "cz", frequency: "common" },
  DK: { tld: "dk", frequency: "common" },
  EE: { tld: "ee", frequency: "common" },
  FO: { tld: "fo", frequency: "uncommon", mnemonic: "Faroe Islands" },
  FI: { tld: "fi", frequency: "common" },
  FR: { tld: "fr", frequency: "common" },
  DE: { tld: "de", frequency: "common", mnemonic: "Deutschland" },
  GI: { tld: "gi", frequency: "rare" },
  GR: { tld: "gr", frequency: "common" },
  GL: { tld: "gl", frequency: "uncommon" },
  GG: { tld: "gg", frequency: "rare", note: "Popular for gaming sites" },
  HU: { tld: "hu", frequency: "common" },
  IS: { tld: "is", frequency: "common" },
  IE: { tld: "ie", frequency: "common" },
  IM: { tld: "im", frequency: "rare" },
  IT: { tld: "it", frequency: "common" },
  JE: { tld: "je", frequency: "rare" },
  XK: { tld: "xk", frequency: "rare", note: "Kosovo - unofficial TLD" },
  LV: { tld: "lv", frequency: "common" },
  LI: { tld: "li", frequency: "rare" },
  LT: { tld: "lt", frequency: "common" },
  LU: { tld: "lu", frequency: "uncommon" },
  MT: { tld: "mt", frequency: "uncommon" },
  MD: { tld: "md", frequency: "rare" },
  MC: { tld: "mc", frequency: "rare" },
  ME: { tld: "me", frequency: "uncommon", note: "Popular for personal sites" },
  NL: { tld: "nl", frequency: "common", mnemonic: "Nederland" },
  MK: { tld: "mk", frequency: "uncommon", mnemonic: "Macedonia (North)" },
  NO: { tld: "no", frequency: "common" },
  PL: { tld: "pl", frequency: "common" },
  PT: { tld: "pt", frequency: "common" },
  RO: { tld: "ro", frequency: "common" },
  RU: { tld: "ru", frequency: "common" },
  SM: { tld: "sm", frequency: "rare" },
  RS: { tld: "rs", frequency: "common" },
  SK: { tld: "sk", frequency: "common" },
  SI: { tld: "si", frequency: "common" },
  ES: { tld: "es", frequency: "common", mnemonic: "Espana" },
  SE: { tld: "se", frequency: "common" },
  CH: { tld: "ch", frequency: "common", mnemonic: "Confoederatio Helvetica" },
  UA: { tld: "ua", frequency: "common" },
  GB: { tld: "gb", frequency: "rare", note: "UK mainly uses .uk instead" },
  UK: { tld: "uk", frequency: "common", note: "Primary TLD for United Kingdom" },
  VA: { tld: "va", frequency: "rare" },

  // North America
  AG: { tld: "ag", frequency: "rare" },
  AI: { tld: "ai", frequency: "rare", note: "Popular for AI company sites" },
  AW: { tld: "aw", frequency: "rare" },
  BS: { tld: "bs", frequency: "rare" },
  BB: { tld: "bb", frequency: "rare" },
  BZ: { tld: "bz", frequency: "rare" },
  BM: { tld: "bm", frequency: "uncommon" },
  VG: { tld: "vg", frequency: "rare" },
  CA: { tld: "ca", frequency: "common" },
  KY: { tld: "ky", frequency: "rare" },
  CR: { tld: "cr", frequency: "uncommon" },
  CU: { tld: "cu", frequency: "rare" },
  CW: { tld: "cw", frequency: "rare" },
  DM: { tld: "dm", frequency: "rare" },
  DO: { tld: "do", frequency: "uncommon" },
  SV: { tld: "sv", frequency: "rare" },
  GD: { tld: "gd", frequency: "rare" },
  GP: { tld: "gp", frequency: "rare" },
  GT: { tld: "gt", frequency: "uncommon" },
  HT: { tld: "ht", frequency: "rare" },
  HN: { tld: "hn", frequency: "rare" },
  JM: { tld: "jm", frequency: "rare" },
  MQ: { tld: "mq", frequency: "rare" },
  MX: { tld: "mx", frequency: "common" },
  MS: { tld: "ms", frequency: "rare" },
  NI: { tld: "ni", frequency: "rare" },
  PA: { tld: "pa", frequency: "rare" },
  PR: { tld: "pr", frequency: "uncommon" },
  KN: { tld: "kn", frequency: "rare" },
  LC: { tld: "lc", frequency: "rare" },
  VC: { tld: "vc", frequency: "rare" },
  SX: { tld: "sx", frequency: "rare" },
  TT: { tld: "tt", frequency: "rare" },
  TC: { tld: "tc", frequency: "rare" },
  US: { tld: "us", frequency: "common", note: "Less common than .com in US" },
  VI: { tld: "vi", frequency: "rare" },

  // Oceania
  AS: { tld: "as", frequency: "rare" },
  AU: { tld: "au", frequency: "common" },
  CX: { tld: "cx", frequency: "rare" },
  CC: { tld: "cc", frequency: "rare", note: "Popular for URL shorteners" },
  CK: { tld: "ck", frequency: "rare" },
  FJ: { tld: "fj", frequency: "rare" },
  PF: { tld: "pf", frequency: "rare" },
  GU: { tld: "gu", frequency: "uncommon" },
  KI: { tld: "ki", frequency: "rare" },
  MH: { tld: "mh", frequency: "rare" },
  FM: { tld: "fm", frequency: "rare", note: "Popular for radio/podcast sites" },
  NR: { tld: "nr", frequency: "rare" },
  NC: { tld: "nc", frequency: "rare" },
  NZ: { tld: "nz", frequency: "common" },
  NU: { tld: "nu", frequency: "rare", note: "Popular in Sweden (means 'now')" },
  NF: { tld: "nf", frequency: "rare" },
  MP: { tld: "mp", frequency: "rare" },
  PW: { tld: "pw", frequency: "rare" },
  PG: { tld: "pg", frequency: "rare" },
  WS: { tld: "ws", frequency: "rare", note: "Popular for URL shorteners" },
  SB: { tld: "sb", frequency: "rare" },
  TO: { tld: "to", frequency: "rare", note: "Popular for URL shorteners" },
  TV: { tld: "tv", frequency: "rare", note: "Popular for streaming sites" },
  VU: { tld: "vu", frequency: "rare" },

  // South America
  AR: { tld: "ar", frequency: "common" },
  BO: { tld: "bo", frequency: "uncommon" },
  BR: { tld: "br", frequency: "common" },
  CL: { tld: "cl", frequency: "common" },
  CO: { tld: "co", frequency: "common", note: "Also used as .com alternative" },
  EC: { tld: "ec", frequency: "common" },
  FK: { tld: "fk", frequency: "rare" },
  GF: { tld: "gf", frequency: "rare" },
  GY: { tld: "gy", frequency: "rare" },
  PY: { tld: "py", frequency: "rare" },
  PE: { tld: "pe", frequency: "common" },
  SR: { tld: "sr", frequency: "rare" },
  UY: { tld: "uy", frequency: "common" },
  VE: { tld: "ve", frequency: "rare" },

  // Special territories and regions
  EU: { tld: "eu", frequency: "uncommon", note: "European Union - not a country" },
  SU: { tld: "su", frequency: "rare", note: "Soviet Union - legacy TLD" },
};

/**
 * Extended country metadata for domains
 * Includes countries not in the main country-meta.ts
 */
const extendedCountryMeta: Record<string, CountryMeta> = {
  // Africa
  DZ: { code: "DZ", name: "Algeria", continent: "Africa" },
  AO: { code: "AO", name: "Angola", continent: "Africa" },
  BJ: { code: "BJ", name: "Benin", continent: "Africa" },
  BF: { code: "BF", name: "Burkina Faso", continent: "Africa" },
  BI: { code: "BI", name: "Burundi", continent: "Africa" },
  CM: { code: "CM", name: "Cameroon", continent: "Africa" },
  CV: { code: "CV", name: "Cape Verde", continent: "Africa" },
  CF: { code: "CF", name: "Central African Republic", continent: "Africa" },
  TD: { code: "TD", name: "Chad", continent: "Africa" },
  KM: { code: "KM", name: "Comoros", continent: "Africa" },
  CD: { code: "CD", name: "Democratic Republic of the Congo", continent: "Africa" },
  CG: { code: "CG", name: "Republic of the Congo", continent: "Africa" },
  CI: { code: "CI", name: "Cote d'Ivoire", continent: "Africa" },
  DJ: { code: "DJ", name: "Djibouti", continent: "Africa" },
  EG: { code: "EG", name: "Egypt", continent: "Africa" },
  GQ: { code: "GQ", name: "Equatorial Guinea", continent: "Africa" },
  ER: { code: "ER", name: "Eritrea", continent: "Africa" },
  ET: { code: "ET", name: "Ethiopia", continent: "Africa" },
  GA: { code: "GA", name: "Gabon", continent: "Africa" },
  GM: { code: "GM", name: "Gambia", continent: "Africa" },
  GN: { code: "GN", name: "Guinea", continent: "Africa" },
  GW: { code: "GW", name: "Guinea-Bissau", continent: "Africa" },
  LR: { code: "LR", name: "Liberia", continent: "Africa" },
  LY: { code: "LY", name: "Libya", continent: "Africa" },
  MG: { code: "MG", name: "Madagascar", continent: "Africa" },
  MW: { code: "MW", name: "Malawi", continent: "Africa" },
  ML: { code: "ML", name: "Mali", continent: "Africa" },
  MR: { code: "MR", name: "Mauritania", continent: "Africa" },
  MU: { code: "MU", name: "Mauritius", continent: "Africa" },
  MA: { code: "MA", name: "Morocco", continent: "Africa" },
  MZ: { code: "MZ", name: "Mozambique", continent: "Africa" },
  NA: { code: "NA", name: "Namibia", continent: "Africa" },
  NE: { code: "NE", name: "Niger", continent: "Africa" },
  RW: { code: "RW", name: "Rwanda", continent: "Africa" },
  ST: { code: "ST", name: "Sao Tome and Principe", continent: "Africa" },
  SC: { code: "SC", name: "Seychelles", continent: "Africa" },
  SL: { code: "SL", name: "Sierra Leone", continent: "Africa" },
  SO: { code: "SO", name: "Somalia", continent: "Africa" },
  SS: { code: "SS", name: "South Sudan", continent: "Africa" },
  SD: { code: "SD", name: "Sudan", continent: "Africa" },
  TZ: { code: "TZ", name: "Tanzania", continent: "Africa" },
  TG: { code: "TG", name: "Togo", continent: "Africa" },
  UG: { code: "UG", name: "Uganda", continent: "Africa" },
  ZM: { code: "ZM", name: "Zambia", continent: "Africa" },
  ZW: { code: "ZW", name: "Zimbabwe", continent: "Africa" },

  // Asia
  AF: { code: "AF", name: "Afghanistan", continent: "Asia" },
  AM: { code: "AM", name: "Armenia", continent: "Asia" },
  AZ: { code: "AZ", name: "Azerbaijan", continent: "Asia" },
  BH: { code: "BH", name: "Bahrain", continent: "Asia" },
  BT: { code: "BT", name: "Bhutan", continent: "Asia" },
  BN: { code: "BN", name: "Brunei", continent: "Asia" },
  CN: { code: "CN", name: "China", continent: "Asia" },
  GE: { code: "GE", name: "Georgia", continent: "Asia" },
  HK: { code: "HK", name: "Hong Kong", continent: "Asia" },
  IR: { code: "IR", name: "Iran", continent: "Asia" },
  IQ: { code: "IQ", name: "Iraq", continent: "Asia" },
  KZ: { code: "KZ", name: "Kazakhstan", continent: "Asia" },
  KW: { code: "KW", name: "Kuwait", continent: "Asia" },
  LB: { code: "LB", name: "Lebanon", continent: "Asia" },
  MO: { code: "MO", name: "Macau", continent: "Asia" },
  MV: { code: "MV", name: "Maldives", continent: "Asia" },
  MM: { code: "MM", name: "Myanmar", continent: "Asia" },
  NP: { code: "NP", name: "Nepal", continent: "Asia" },
  KP: { code: "KP", name: "North Korea", continent: "Asia" },
  OM: { code: "OM", name: "Oman", continent: "Asia" },
  PK: { code: "PK", name: "Pakistan", continent: "Asia" },
  QA: { code: "QA", name: "Qatar", continent: "Asia" },
  SA: { code: "SA", name: "Saudi Arabia", continent: "Asia" },
  SY: { code: "SY", name: "Syria", continent: "Asia" },
  TJ: { code: "TJ", name: "Tajikistan", continent: "Asia" },
  TL: { code: "TL", name: "Timor-Leste", continent: "Asia" },
  TM: { code: "TM", name: "Turkmenistan", continent: "Asia" },
  UZ: { code: "UZ", name: "Uzbekistan", continent: "Asia" },
  YE: { code: "YE", name: "Yemen", continent: "Asia" },

  // Europe
  BY: { code: "BY", name: "Belarus", continent: "Europe" },
  BA: { code: "BA", name: "Bosnia and Herzegovina", continent: "Europe" },
  CY: { code: "CY", name: "Cyprus", continent: "Europe" },
  GI: { code: "GI", name: "Gibraltar", continent: "Europe" },
  GG: { code: "GG", name: "Guernsey", continent: "Europe" },
  XK: { code: "XK", name: "Kosovo", continent: "Europe" },
  LI: { code: "LI", name: "Liechtenstein", continent: "Europe" },
  MD: { code: "MD", name: "Moldova", continent: "Europe" },
  MC: { code: "MC", name: "Monaco", continent: "Europe" },
  VA: { code: "VA", name: "Vatican City", continent: "Europe" },
  UK: { code: "UK", name: "United Kingdom", continent: "Europe" },

  // North America
  AG: { code: "AG", name: "Antigua and Barbuda", continent: "North America" },
  AI: { code: "AI", name: "Anguilla", continent: "North America" },
  AW: { code: "AW", name: "Aruba", continent: "North America" },
  BS: { code: "BS", name: "Bahamas", continent: "North America" },
  BB: { code: "BB", name: "Barbados", continent: "North America" },
  BZ: { code: "BZ", name: "Belize", continent: "North America" },
  VG: { code: "VG", name: "British Virgin Islands", continent: "North America" },
  KY: { code: "KY", name: "Cayman Islands", continent: "North America" },
  CU: { code: "CU", name: "Cuba", continent: "North America" },
  CW: { code: "CW", name: "Curacao", continent: "North America" },
  DM: { code: "DM", name: "Dominica", continent: "North America" },
  SV: { code: "SV", name: "El Salvador", continent: "North America" },
  GD: { code: "GD", name: "Grenada", continent: "North America" },
  GP: { code: "GP", name: "Guadeloupe", continent: "North America" },
  HT: { code: "HT", name: "Haiti", continent: "North America" },
  HN: { code: "HN", name: "Honduras", continent: "North America" },
  JM: { code: "JM", name: "Jamaica", continent: "North America" },
  MQ: { code: "MQ", name: "Martinique", continent: "North America" },
  MS: { code: "MS", name: "Montserrat", continent: "North America" },
  NI: { code: "NI", name: "Nicaragua", continent: "North America" },
  PA: { code: "PA", name: "Panama", continent: "North America" },
  KN: { code: "KN", name: "Saint Kitts and Nevis", continent: "North America" },
  LC: { code: "LC", name: "Saint Lucia", continent: "North America" },
  VC: { code: "VC", name: "Saint Vincent and the Grenadines", continent: "North America" },
  SX: { code: "SX", name: "Sint Maarten", continent: "North America" },
  TT: { code: "TT", name: "Trinidad and Tobago", continent: "North America" },
  TC: { code: "TC", name: "Turks and Caicos Islands", continent: "North America" },
  VI: { code: "VI", name: "U.S. Virgin Islands", continent: "North America" },

  // Oceania
  AS: { code: "AS", name: "American Samoa", continent: "Oceania" },
  CK: { code: "CK", name: "Cook Islands", continent: "Oceania" },
  FJ: { code: "FJ", name: "Fiji", continent: "Oceania" },
  PF: { code: "PF", name: "French Polynesia", continent: "Oceania" },
  KI: { code: "KI", name: "Kiribati", continent: "Oceania" },
  MH: { code: "MH", name: "Marshall Islands", continent: "Oceania" },
  FM: { code: "FM", name: "Micronesia", continent: "Oceania" },
  NR: { code: "NR", name: "Nauru", continent: "Oceania" },
  NC: { code: "NC", name: "New Caledonia", continent: "Oceania" },
  NU: { code: "NU", name: "Niue", continent: "Oceania" },
  NF: { code: "NF", name: "Norfolk Island", continent: "Oceania" },
  MP: { code: "MP", name: "Northern Mariana Islands", continent: "Oceania" },
  PW: { code: "PW", name: "Palau", continent: "Oceania" },
  PG: { code: "PG", name: "Papua New Guinea", continent: "Oceania" },
  WS: { code: "WS", name: "Samoa", continent: "Oceania" },
  SB: { code: "SB", name: "Solomon Islands", continent: "Oceania" },
  TO: { code: "TO", name: "Tonga", continent: "Oceania" },
  TV: { code: "TV", name: "Tuvalu", continent: "Oceania" },
  VU: { code: "VU", name: "Vanuatu", continent: "Oceania" },

  // South America
  FK: { code: "FK", name: "Falkland Islands", continent: "South America" },
  GF: { code: "GF", name: "French Guiana", continent: "South America" },
  GY: { code: "GY", name: "Guyana", continent: "South America" },
  PY: { code: "PY", name: "Paraguay", continent: "South America" },
  SR: { code: "SR", name: "Suriname", continent: "South America" },
  VE: { code: "VE", name: "Venezuela", continent: "South America" },

  // Special
  EU: { code: "EU", name: "European Union", continent: "Europe" },
  SU: { code: "SU", name: "Soviet Union (legacy)", continent: "Europe" },
};

// Import existing country meta
import { countryMeta } from "./country-meta";

/**
 * Build complete domain entries by merging domain data with country metadata
 */
export const domainEntries: DomainEntry[] = Object.entries(domainData)
  .map(([code, data]) => {
    // First try existing country-meta, then extended
    const meta = countryMeta[code] || extendedCountryMeta[code];
    if (!meta) {
      console.warn(`Unknown country code in domains: ${code}`);
      return null;
    }
    return { ...meta, ...data };
  })
  .filter((entry): entry is DomainEntry => entry !== null)
  .sort((a, b) => a.name.localeCompare(b.name));

/** All unique continents from domain data */
export const domainContinents = getContinents();

/** Get all continents that have domain entries */
export function getDomainContinents(): string[] {
  const continents = new Set<string>();
  for (const entry of domainEntries) {
    continents.add(entry.continent);
  }
  return [...continents].sort();
}

/** Filter domains by search query (matches TLD or country name) */
export function searchDomains(query: string): DomainEntry[] {
  const normalized = query.toLowerCase().replace(/^\./, "");
  if (!normalized) return domainEntries;

  return domainEntries.filter(
    (entry) =>
      entry.tld.includes(normalized) ||
      entry.name.toLowerCase().includes(normalized) ||
      entry.code.toLowerCase().includes(normalized),
  );
}

/** Filter domains by continent */
export function filterByContinent(continent: string | null): DomainEntry[] {
  if (!continent) return domainEntries;
  return domainEntries.filter((entry) => entry.continent === continent);
}

/** Get common GeoGuessr domains (most likely to appear in street view) */
export function getCommonDomains(): DomainEntry[] {
  return domainEntries.filter((entry) => entry.frequency === "common");
}

/** Get domains with mnemonics (non-obvious mappings) */
export function getDomainsWithMnemonics(): DomainEntry[] {
  return domainEntries.filter((entry) => entry.mnemonic);
}

/** Total count of domains */
export const totalDomainCount = domainEntries.length;

/** Count by frequency */
export const domainStats = {
  total: domainEntries.length,
  common: domainEntries.filter((e) => e.frequency === "common").length,
  uncommon: domainEntries.filter((e) => e.frequency === "uncommon").length,
  rare: domainEntries.filter((e) => e.frequency === "rare").length,
};
