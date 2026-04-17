import type { MetadataRoute } from 'next';
import { baseSEO } from '@/lib/seo-config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseSEO.siteUrl}/sitemap.xml`,
    host: baseSEO.siteUrl,
  };
}
