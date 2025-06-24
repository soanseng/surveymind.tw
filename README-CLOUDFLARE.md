# Cloudflare Pages Deployment Guide

## 📋 Prerequisites

- Cloudflare account
- GitHub repository with the code
- Node.js 18+ for local development

## 🚀 Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** in the sidebar
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your GitHub repository: `quenstionnaire`

### 2. Configure Build Settings

**Build Configuration:**
```
Build command: npm run build
Build output directory: out
Root directory: (leave empty)
```

**Environment Variables:**
```
NODE_ENV = production
NEXT_PUBLIC_SITE_URL = https://your-domain.pages.dev
```

### 3. Build Settings Details

The project is configured with:
- ✅ Static export (`output: 'export'`)
- ✅ Optimized for Cloudflare Pages
- ✅ Proper cache headers
- ✅ Security headers
- ✅ SEO optimization

### 4. Custom Domain Setup (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click **Custom domains** tab
3. Add your domain (e.g., `questionnaire.anxiety.com.tw`)
4. Follow DNS configuration instructions

## 🔧 Configuration Files

### Next.js Configuration (`next.config.mjs`)
- Static export enabled
- Cloudflare Pages optimizations
- Image optimization disabled for static export
- Trailing slashes enabled
- Deterministic chunk IDs for caching

### Cloudflare Pages Files
- `_headers` - Security and cache headers
- `_redirects` - URL redirects and SEO rules
- `wrangler.toml` - Cloudflare Pages configuration
- `robots.txt` - SEO and crawler instructions
- `sitemap.xml` - Search engine indexing

## 📊 Performance Optimizations

### Caching Strategy
- **Static assets**: 1 year cache (immutable)
- **HTML files**: 1 hour cache
- **Images**: 1 year cache
- **Fonts**: 1 year cache

### Security Headers
- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Medical disclaimer headers

### SEO Features
- Traditional Chinese (zh-TW) optimization
- Structured data (JSON-LD)
- Open Graph meta tags
- Twitter Cards
- Canonical URLs
- Sitemap and robots.txt

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm run serve
```

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
- Ensure Node.js version is 18+
- Check for any server-side code that needs to be removed
- Verify all imports are correct

**Static Export Issues:**
- Remove any dynamic routes with `getServerSideProps`
- Ensure all images use `unoptimized: true`
- Check for any server-only dependencies

**SEO Issues:**
- Verify `NEXT_PUBLIC_SITE_URL` environment variable
- Check meta tags in browser dev tools
- Validate structured data with Google's Rich Results Test

### Performance Monitoring

- Use Cloudflare Analytics for traffic insights
- Monitor Core Web Vitals in Cloudflare dashboard
- Check PageSpeed Insights for optimization opportunities

## 📱 PWA Support

The site includes PWA manifest (`manifest.json`) with:
- Offline support preparation
- App-like experience on mobile
- Custom shortcuts for popular questionnaires
- Taiwan-localized content

## 🌐 Multi-language Considerations

Current setup:
- Primary language: Traditional Chinese (zh-TW)
- Optimized for Taiwan market
- Proper hreflang tags
- Regional SEO optimization

## 🔐 Security Features

- Medical content disclaimers
- Secure headers configuration
- CSP policy for medical applications
- No storage of personal health data
- Client-side processing only

## 📈 Analytics Setup (Optional)

To add Google Analytics:
1. Add tracking ID to environment variables
2. Update CSP policy in `_headers`
3. Add tracking script to SEO component

## 🚀 Deployment Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured correctly
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] SEO meta tags verified
- [ ] Performance tested
- [ ] Mobile responsiveness confirmed
- [ ] Medical disclaimers in place

## 📞 Support

For deployment issues:
- Check Cloudflare Pages documentation
- Monitor build logs in Cloudflare dashboard
- Verify configuration files are properly formatted

For application issues:
- Check browser console for errors
- Validate HTML and CSS
- Test questionnaire functionality