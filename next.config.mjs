/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  async headers() {
    return [
      {
        source: '/(.*)', // Aplica para todas as rotas
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Use SAMEORIGIN para compatibilidade
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Substitua "*" por um domínio específico, se necessário
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', // Força o uso de HTTPS
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://sei-apresentacao.trf2.jus.br", // Substitui X-Frame-Options
          },
        ],
      },
    ];
  },
};

export default nextConfig;