import type { CountryCode } from "./types";

export function getFlagEmoji(countryCode: CountryCode): string {
  const REGIONAL_INDICATOR_OFFSET = 127397;
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => REGIONAL_INDICATOR_OFFSET + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getCountryName(
  countryCode: CountryCode,
  locale: string = "en"
): string {
  return (
    new Intl.DisplayNames([locale], { type: "region" }).of(
      countryCode.toUpperCase()
    ) ?? countryCode
  );
}
