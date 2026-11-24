/**
 * Helpers SEO — metadata, Open Graph, JSON-LD.
 * Référence : CLAUDE.md §11.
 */

export interface SeoProps {
  title: string;
  description: string;
  path: string; // ex: "/a-propos"
  ogImage?: string; // ex: "/images/og-default.jpg"
}

export const SITE_NAME = "AFRIK'LEARN Consulting";
export const SITE_URL = "https://afriklearn-consulting.com";
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * JSON-LD Organization — à injecter sur la page d'accueil.
 * {{PLACEHOLDER}} à remplacer avec les informations légales réelles
 * avant mise en production (voir docs/dor-sprint-1.md).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AFRIK'LEARN Consulting",
    legalName: "AFRIK'LEARN CONSULTING SARL",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    address: {
      // Adresse précise confirmée via le flyer officiel AFRIK'LEARN Consulting
      // (Canva, 28/10/2026) : "Situé à Angré Mahou".
      "@type": "PostalAddress",
      streetAddress: "Angré Mahou",
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
    sameAs: [
      // {{PLACEHOLDER_LINKEDIN}}
      // {{PLACEHOLDER_FACEBOOK}}
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}
