import { Head } from 'vite-react-ssg';
import { baseSEO, SEOConfig, organizationStructuredData } from '@/lib/seo-config';

interface SEOHeadProps {
  config: SEOConfig;
  path?: string;
  customTitle?: string;
  customDescription?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  config, 
  path = '', 
  customTitle, 
  customDescription 
}) => {
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const normalizedPath = !path || path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
  const url = `${baseSEO.siteUrl}${normalizedPath}`;
  const imageUrl = `${baseSEO.siteUrl}${baseSEO.defaultImage}`;

  // Create WebPage structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": "zh-TW",
    "isPartOf": {
      "@type": "WebSite",
      "name": baseSEO.siteName,
      "url": baseSEO.siteUrl
    },
    "about": {
      "@type": "MedicalCondition",
      "name": "Mental Health Assessment"
    },
    "publisher": organizationStructuredData
  };

  // Create MedicalRiskEstimator structured data for questionnaires
  const medicalRiskEstimatorData = config.structuredData ? {
    "@context": "https://schema.org",
    "@type": "MedicalRiskEstimator",
    "name": config.structuredData.name,
    "description": config.structuredData.description,
    "url": url,
    "estimatesRiskOf": {
      "@type": "MedicalCondition",
      "name": config.structuredData.category
    },
    "includedRiskFactor": {
      "@type": "MedicalRiskFactor",
      "name": "Psychological Symptoms"
    },
    "guidelineDate": new Date().toISOString().split('T')[0],
    "riskFactor": "Self-reported symptoms"
  } : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={config.keywords.join(", ")} />
      <meta httpEquiv="content-language" content="zh-TW" />
      <meta name="language" content="zh-TW" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta property="og:title" content={config.openGraph.title} />
      <meta property="og:description" content={config.openGraph.description} />
      <meta property="og:type" content={config.openGraph.type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={config.openGraph.locale} />
      <meta property="og:site_name" content={baseSEO.siteName} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.openGraph.title} />
      <meta name="twitter:description" content={config.openGraph.description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@anxiety_tw" />
      <meta name="author" content="陳璿丞醫師 - 台中文心樂丞、理解身心診所" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="health:category" content="Mental Health" />
      <meta name="health:specialty" content="Psychiatry" />
      <meta name="medlineplus" content="mental health assessment" />
      <meta property="article:publisher" content={baseSEO.siteUrl} />
      <meta property="article:author" content="陳璿丞醫師" />
      <meta property="article:section" content="Mental Health" />
      <meta property="article:tag" content={config.keywords.slice(0, 5).join(", ")} />
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="geo.country" content="TW" />
      <meta name="geo.region" content="TW" />
      <meta name="ICBM" content="23.8, 121.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="心理健康評估" />
      {config.alternativeTitle && <meta name="alternative-title" content={config.alternativeTitle} />}
      <link rel="alternate" hrefLang="zh-TW" href={url} />
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <script type="application/ld+json">{JSON.stringify(webPageStructuredData)}</script>
      {medicalRiskEstimatorData && (
        <script type="application/ld+json">{JSON.stringify(medicalRiskEstimatorData)}</script>
      )}
      <script type="application/ld+json">{JSON.stringify(organizationStructuredData)}</script>
    </Head>
  );
};

export default SEOHead;
