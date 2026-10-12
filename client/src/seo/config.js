// Central SEO + brand configuration.
// Set VITE_SITE_URL in client/.env (and SITE_URL on the server) to the real domain,
// e.g. https://jewelify.com.bd — no trailing slash.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://jewelify.onrender.com').replace(/\/$/, '');

export const SITE_NAME = 'Jewelify';

export const DEFAULT_TITLE = 'Jewelify — Trendy Earrings for Girls & Women in Bangladesh';

export const DEFAULT_DESCRIPTION =
  "Shop trendy women's earrings online in Bangladesh — Korean studs, hoops, pearl drops & more from ৳250. Cash on delivery, fast nationwide delivery.";

export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80';

// IMPORTANT: update these to the real Jewelify profiles once created.
// Google uses sameAs links to verify the brand entity, and BD customers
// check Facebook/Instagram before trusting a new shop with their money.
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/jewelify.bd',
  instagram: 'https://www.instagram.com/jewelify.bd',
  tiktok: 'https://www.tiktok.com/@jewelify.bd',
};
