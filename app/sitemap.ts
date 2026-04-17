import type { MetadataRoute } from 'next';
import { baseSEO, questionnaireSEO } from '@/lib/seo-config';

export const dynamic = 'force-static';

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const questionnairePaths = Object.keys(questionnaireSEO).map((slug) => ({
    url: `${baseSEO.siteUrl}/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseSEO.siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...questionnairePaths,
  ];
}
