import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Only run obfuscation on the client-side code in production builds
        if (!dev && !isServer) {
            config.plugins.push(
                new JavaScriptObfuscator({
                    rotateStringArray: true,
                    // Add more options here based on your needs
                }, ['**/bundles/**/*.js'])
            );
        }

        // Important: return the modified config
        return config;
    },
};

export default nextConfig;