'use client'
import Head from 'next/head';
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
  const url = `${baseSEO.siteUrl}${path}`;
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
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={config.keywords.join(', ')} />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="zh-TW" />
      <meta name="language" content="zh-TW" />
      <link rel="alternate" hrefLang="zh-TW" href={url} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Charset */}
      <meta charSet="UTF-8" />
      
      {/* Open Graph Tags */}
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
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.openGraph.title} />
      <meta name="twitter:description" content={config.openGraph.description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@anxiety_tw" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="陳璿丞醫師 - 台中文心樂丞、理解身心診所" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Medical/Health Specific Meta Tags */}
      <meta name="health:category" content="Mental Health" />
      <meta name="health:specialty" content="Psychiatry" />
      <meta name="medlineplus" content="mental health assessment" />
      
      {/* Article Meta Tags */}
      <meta property="article:publisher" content={baseSEO.siteUrl} />
      <meta property="article:author" content="陳璿丞醫師" />
      <meta property="article:section" content="Mental Health" />
      <meta property="article:tag" content={config.keywords.slice(0, 5).join(', ')} />
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData)
        }}
      />
      
      {/* Medical Risk Estimator Structured Data (for questionnaires) */}
      {medicalRiskEstimatorData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalRiskEstimatorData)
          }}
        />
      )}
      
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Additional Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      
      {/* Alternative Title for Search Engines */}
      {config.alternativeTitle && (
        <meta name="alternative-title" content={config.alternativeTitle} />
      )}
      
      {/* Content Classification */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Tags for Taiwan */}
      <meta name="geo.country" content="TW" />
      <meta name="geo.region" content="TW" />
      <meta name="ICBM" content="23.8, 121.0" />
      
      {/* Mobile Web App Capable */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="心理健康評估" />
    </Head>
  );
};

export default SEOHead;