"use client";

import SEOHead from "@/components/SEOHead";
import { questionnaireSEO } from "@/lib/seo-config";

export default function FibromyalgiaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead config={questionnaireSEO["fibromyalgia"]} path="/fibromyalgia" />
      <h1 className="text-3xl font-bold text-center mb-6">
        纖維肌痛症 (ACR 2016 WPI+SSS)
      </h1>
      <p className="text-center text-gray-600">（建置中）</p>
    </div>
  );
}
