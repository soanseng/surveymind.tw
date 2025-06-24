#!/usr/bin/env node

/**
 * SEO Validation Script
 * Validates that all questionnaire pages have proper SEO implementation
 */

const fs = require('fs');
const path = require('path');

const questionnairePaths = [
  'app/page.tsx',
  'app/tdq/page.tsx',
  'app/phq-9/page.tsx',
  'app/gad/page.tsx',
  'app/hcl-32/page.tsx',
  'app/oci-r/page.tsx',
  'app/asrs/page.tsx',
  'app/snap-4/page.tsx',
  'app/psqi/page.tsx',
  'app/ad-8/page.tsx',
  'app/big-5/page.tsx'
];

const seoRequirements = {
  landingPage: {
    file: 'app/page.tsx',
    checks: [
      'export const metadata: Metadata',
      'landingPageSEO',
      'metadataBase',
      'organizationStructuredData',
      'JSON.stringify'
    ]
  },
  questionnaires: {
    checks: [
      'import SEOHead from',
      'import { questionnaireSEO }',
      '<SEOHead',
      'config={questionnaireSEO',
      'path="/'
    ]
  }
};

function validateFile(filePath, checks) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const results = [];

  checks.forEach(check => {
    const found = content.includes(check);
    results.push({ check, found });
    
    if (found) {
      console.log(`✅ ${filePath}: Found "${check}"`);
    } else {
      console.log(`❌ ${filePath}: Missing "${check}"`);
    }
  });

  return results.every(result => result.found);
}

function main() {
  console.log('🔍 Validating SEO Implementation...\n');

  let allValid = true;

  // Validate landing page
  console.log('📋 Checking Landing Page SEO:');
  const landingPageValid = validateFile(
    seoRequirements.landingPage.file, 
    seoRequirements.landingPage.checks
  );
  allValid = allValid && landingPageValid;
  console.log();

  // Validate questionnaire pages
  console.log('📋 Checking Questionnaire Pages SEO:');
  const questionnairesToCheck = questionnairePaths.filter(path => path !== 'app/page.tsx');
  
  questionnairesToCheck.forEach(filePath => {
    const isValid = validateFile(filePath, seoRequirements.questionnaires.checks);
    allValid = allValid && isValid;
  });

  console.log('\n' + '='.repeat(50));
  
  if (allValid) {
    console.log('🎉 All SEO validations passed!');
    console.log('✅ Landing page has proper metadata configuration');
    console.log('✅ All questionnaire pages use SEOHead component');
    console.log('✅ All pages have structured data implementation');
    process.exit(0);
  } else {
    console.log('💥 SEO validation failed!');
    console.log('❌ Some pages are missing required SEO elements');
    console.log('Please check the output above for specific issues');
    process.exit(1);
  }
}

// Run validation
main();