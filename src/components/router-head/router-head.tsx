import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  const title = head.title
    ? `${head.title} | GeoHints`
    : "GeoHints - Geographic Language Hints for GeoGuessr";
  const description =
    head.meta.find((m) => m.name === "description")?.content ||
    "Learn to identify countries by their unique characters and language patterns. Perfect for GeoGuessr players.";

  return (
    <>
      <title>{title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="GeoGuessr, geography, language hints, country identification, special characters"
      />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:site_name" content="GeoHints" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
