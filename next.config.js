/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/auth',
                destination: '/sign-in',
                permanent: true,
            },
        ];
    },
    images: {
        domains: ['images.unsplash.com', 'images.clerk.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

export default nextConfig
