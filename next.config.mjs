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
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self' https://sei-apresentacao.trf2.jus.br;" // Permite iframe apenas de https://sei-apresentacao.trf2.jus.br
              }
            ]
          }
        ]
      }
};

export default nextConfig