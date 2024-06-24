/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_BASEPAHT : "http://localhost:3000/"
    },
    reactStrictMode: false,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
