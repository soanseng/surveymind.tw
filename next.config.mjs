import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Static export for Cloudflare Pages (disabled for development)
    ...(process.env.NODE_ENV === 'production' && {
        output: 'export',
        distDir: 'out',
        trailingSlash: true,
    }),
    
    // Disable image optimization for static export
    images: { 
        unoptimized: true,
        // Remove domains restriction for static export
        remotePatterns: []
    },
    
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Only run obfuscation on the client-side code in production builds
        if (!dev && !isServer) {
            config.plugins.push(
                new JavaScriptObfuscator({
                    rotateStringArray: true,
                    stringArray: true,
                    stringArrayThreshold: 0.75,
                    unicodeEscapeSequence: false,
                    // Optimize for better performance on Cloudflare Pages
                    compact: true,
                    deadCodeInjection: false, // Disable for better performance
                    debugProtection: false, // Disable for Cloudflare compatibility
                }, ['**/bundles/**/*.js'])
            );
        }

        // Optimize for static deployment
        if (!dev) {
            config.optimization = {
                ...config.optimization,
                // Ensure consistent chunk naming for caching
                moduleIds: 'deterministic',
                chunkIds: 'deterministic'
            };
        }

        // Important: return the modified config
        return config;
    },
};

export default nextConfig;