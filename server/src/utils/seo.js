import fs from 'fs';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// ---------------------------------------------------------------------------
// Server-side SEO for the React SPA.
// Injects per-route <title>, meta description, canonical, Open Graph and
// JSON-LD into index.html before it is sent, so crawlers and social scrapers
// (Facebook, TikTok, WhatsApp — none of which run JavaScript) see full data.
// ---------------------------------------------------------------------------

const SITE_URL = (process.env.SITE_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
const SITE_NAME = 'Jewelify';
const DEFAULT_TITLE = 'Jewelify — Trendy Earrings for Girls & Women in Bangladesh';
const DEFAULT_DESC =
  "Shop trendy women's earrings online in Bangladesh — Korean studs, hoops, pearl drops & more from ৳250. Cash on delivery, fast nationwide delivery.";
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Keep in sync with client/src/content/posts.js
const BLOG_SLUGS = ['best-earrings-for-your-face-shape', 'stop-earrings-tarnishing-humid-bangladesh'];

// Human-facing headings for known category slugs (fallback: "<Name> Earrings")
const CATEGORY_HEADINGS = {
  studs: 'Stud Earrings',
  hoops: 'Hoop Earrings',
  drops: 'Drop Earrings',
  dangles: 'Dangle Earrings',
  chandeliers: 'Chandelier Earrings',
  pearl: 'Pearl Earrings',
};

const STATIC_META = {
  '/': { title: DEFAULT_TITLE, description: DEFAULT_DESC },
  '/shop': {
    title: `Shop Earrings Online in Bangladesh | ${SITE_NAME}`,
    description: 'Browse all earrings — studs, hoops, drops, dangles & pearls. Trendy, skin-friendly designs from ৳250 with cash on delivery across Bangladesh.',
  },
  '/categories': {
    title: `Earring Categories — Studs, Hoops, Drops & More | ${SITE_NAME}`,
    description: 'Shop earrings by category: stud, hoop, drop, dangle, chandelier and pearl earrings, curated for girls and women in Bangladesh.',
  },
  '/deals': {
    title: `Earring Deals & Discounts in Bangladesh | ${SITE_NAME}`,
    description: 'Earrings on sale in Bangladesh — grab trendy studs, hoops and drops at discounted prices. Limited stock, cash on delivery available.',
  },
  '/blog': {
    title: 'Earring Guides, Styling Tips & Care — The Jewelify Blog',
    description: 'Guides for girls in Bangladesh: how to choose earrings for your face shape, stop tarnishing in humid weather, and style Korean earrings.',
  },
  '/about': {
    title: `About ${SITE_NAME} — Earrings Curated for Bangladeshi Girls`,
    description: 'Jewelify curates trendy, skin-friendly, budget-friendly earrings for girls and young women in Bangladesh. Cash on delivery, easy exchange.',
  },
  '/contact': {
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Questions about an order, sizing or a gift? Message the Jewelify team — we reply fast and deliver all over Bangladesh.',
  },
};

const NOINDEX_PATTERNS = [/^\/cart/, /^\/checkout/, /^\/login/, /^\/register/, /^\/profile/, /^\/orders/, /^\/admin/];

// Simple 5-minute in-memory cache so DB lookups don't run on every request
const cache = new Map();
const cached = async (key, fn) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await fn();
  cache.set(key, { value, expires: Date.now() + 5 * 60 * 1000 });
  return value;
};

const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
});

const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

const productSchema = (p) => {
  const price = Math.round(p.price - (p.price * (p.discountPercent || 0)) / 100);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images?.length ? p.images : [DEFAULT_IMAGE],
    description: p.description,
    category: p.category?.name || 'Earrings',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${p.slug}`,
      priceCurrency: 'BDT',
      price,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(p.numReviews > 0 && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.numReviews },
    }),
  };
};

async function resolveMeta(pathname) {
  if (NOINDEX_PATTERNS.some((re) => re.test(pathname))) {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESC, robots: 'noindex,nofollow', jsonLd: [] };
  }

  const productMatch = pathname.match(/^\/product\/([a-z0-9-]+)$/);
  if (productMatch) {
    const product = await cached(`product:${productMatch[1]}`, () =>
      Product.findOne({ slug: productMatch[1] }).populate('category', 'name slug').lean()
    );
    if (!product) {
      return { title: `Product not found | ${SITE_NAME}`, description: DEFAULT_DESC, robots: 'noindex', jsonLd: [] };
    }
    const price = Math.round(product.price - (product.price * (product.discountPercent || 0)) / 100);
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      ...(product.category?.slug ? [{ name: product.category.name, path: `/category/${product.category.slug}` }] : []),
      { name: product.name, path: `/product/${product.slug}` },
    ];
    return {
      title: `${product.name} — ৳${price.toLocaleString('en-IN')} | ${SITE_NAME} Bangladesh`,
      description: `${String(product.description).slice(0, 140)}… Order online with cash on delivery anywhere in Bangladesh.`,
      image: product.images?.[0],
      type: 'product',
      jsonLd: [productSchema(product), breadcrumbSchema(crumbs)],
    };
  }

  const categoryMatch = pathname.match(/^\/category\/([a-z0-9-]+)$/);
  if (categoryMatch) {
    const category = await cached(`category:${categoryMatch[1]}`, () =>
      Category.findOne({ slug: categoryMatch[1] }).lean()
    );
    if (!category) {
      return { title: `Category not found | ${SITE_NAME}`, description: DEFAULT_DESC, robots: 'noindex', jsonLd: [] };
    }
    const heading = CATEGORY_HEADINGS[category.slug] || `${category.name} Earrings`;
    return {
      title: `${heading} — Price in Bangladesh | ${SITE_NAME}`,
      description: `${category.description || `Shop ${heading.toLowerCase()} online in Bangladesh.`} Trendy, skin-friendly designs with cash on delivery nationwide.`,
      image: category.image,
      jsonLd: [
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: heading, path: `/category/${category.slug}` },
        ]),
      ],
    };
  }

  const staticMeta = STATIC_META[pathname];
  if (staticMeta) {
    const jsonLd = pathname === '/' ? [orgSchema(), websiteSchema()] : [];
    return { ...staticMeta, jsonLd };
  }

  return { title: DEFAULT_TITLE, description: DEFAULT_DESC, robots: 'index,follow', jsonLd: [] };
}

function inject(template, meta, pathname) {
  const canonical = `${SITE_URL}${pathname}`;
  const tags = [
    `<meta name="robots" content="${meta.robots || 'index,follow'}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${meta.type || 'website'}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(meta.image || DEFAULT_IMAGE)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(meta.image || DEFAULT_IMAGE)}" />`,
    ...(meta.jsonLd || []).map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`),
  ].join('\n    ');

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" ?\/>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('</head>', `    ${tags}\n  </head>`);
}

/** Express handler factory: serves index.html with per-route SEO injected. */
export function serveSpaWithSeo(templatePath) {
  const template = fs.readFileSync(templatePath, 'utf8');
  return async (req, res) => {
    try {
      const meta = await resolveMeta(req.path);
      res.send(inject(template, meta, req.path));
    } catch (err) {
      console.error('SEO injection failed, serving plain template:', err.message);
      res.send(template);
    }
  };
}

export async function sitemapXml(_req, res) {
  try {
    const [products, categories] = await Promise.all([
      Product.find({}, 'slug updatedAt').lean(),
      Category.find({}, 'slug updatedAt').lean(),
    ]);

    const url = (loc, { lastmod, changefreq = 'weekly', priority = '0.7' } = {}) =>
      `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n${lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

    const entries = [
      url('/', { changefreq: 'daily', priority: '1.0' }),
      url('/shop', { changefreq: 'daily', priority: '0.9' }),
      url('/categories', { priority: '0.8' }),
      url('/deals', { changefreq: 'daily', priority: '0.8' }),
      url('/blog', { priority: '0.7' }),
      url('/about', { changefreq: 'monthly', priority: '0.4' }),
      url('/contact', { changefreq: 'monthly', priority: '0.4' }),
      ...BLOG_SLUGS.map((s) => url(`/blog/${s}`, { changefreq: 'monthly', priority: '0.6' })),
      ...categories.map((c) => url(`/category/${c.slug}`, { lastmod: c.updatedAt, priority: '0.8' })),
      ...products.map((p) => url(`/product/${p.slug}`, { lastmod: p.updatedAt, priority: '0.7' })),
    ];

    res
      .type('application/xml')
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`);
  } catch (err) {
    res.status(500).send('Sitemap generation failed');
  }
}

export function robotsTxt(_req, res) {
  res.type('text/plain').send(
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders

Sitemap: ${SITE_URL}/sitemap.xml
`
  );
}
