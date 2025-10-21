interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

/**
 * Update meta tags for SEO
 */
export const updateMetaTags = (tags: MetaTags): void => {
  // Title
  if (tags.title) {
    document.title = tags.title;
    updateOrCreateMetaTag('og:title', tags.ogTitle || tags.title);
    updateOrCreateMetaTag('twitter:title', tags.twitterTitle || tags.title);
  }

  // Description
  if (tags.description) {
    updateOrCreateMetaTag('description', tags.description);
    updateOrCreateMetaTag(
      'og:description',
      tags.ogDescription || tags.description
    );
    updateOrCreateMetaTag(
      'twitter:description',
      tags.twitterDescription || tags.description
    );
  }

  // Keywords
  if (tags.keywords) {
    updateOrCreateMetaTag('keywords', tags.keywords);
  }

  // Author
  if (tags.author) {
    updateOrCreateMetaTag('author', tags.author);
  }

  // Open Graph
  if (tags.ogImage) {
    updateOrCreateMetaTag('og:image', tags.ogImage);
  }
  if (tags.ogUrl) {
    updateOrCreateMetaTag('og:url', tags.ogUrl);
  }
  updateOrCreateMetaTag('og:type', 'website');

  // Twitter Card
  if (tags.twitterCard) {
    updateOrCreateMetaTag('twitter:card', tags.twitterCard);
  }
  if (tags.twitterImage) {
    updateOrCreateMetaTag('twitter:image', tags.twitterImage);
  }

  // Canonical URL
  if (tags.canonical) {
    updateOrCreateLinkTag('canonical', tags.canonical);
  }
};

/**
 * Update or create a meta tag
 */
const updateOrCreateMetaTag = (name: string, content: string): void => {
  // Check if it's an Open Graph or Twitter tag
  const property = name.startsWith('og:') || name.startsWith('twitter:');
  const attribute = property ? 'property' : 'name';

  let element = document.querySelector(
    `meta[${attribute}="${name}"]`
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

/**
 * Update or create a link tag
 */
const updateOrCreateLinkTag = (rel: string, href: string): void => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export const generateStructuredData = (type: string, data: any): void => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  });

  // Remove existing structured data script if exists
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  document.head.appendChild(script);
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbs = (
  items: Array<{ name: string; url: string }>
): void => {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'breadcrumb-schema';
  script.text = JSON.stringify(breadcrumbList);

  const existing = document.getElementById('breadcrumb-schema');
  if (existing) {
    existing.remove();
  }

  document.head.appendChild(script);
};

/**
 * Generate product structured data (for tours/hotels)
 */
export const generateProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
}): void => {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
    },
  };

  if (product.rating && product.reviewCount) {
    Object.assign(productSchema, {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    });
  }

  generateStructuredData('Product', productSchema);
};

/**
 * Set robots meta tag
 */
export const setRobots = (content: string): void => {
  updateOrCreateMetaTag('robots', content);
};

/**
 * Generate sitemap (this would typically be done server-side)
 */
export const generateSitemapXML = (
  urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  }>
): string => {
  const urlEntries = urls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>
  `
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
};
