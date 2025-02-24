/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';
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
            value: 'ALLOW-FROM https://sei-apresentacao.trf2.jus.br' // Permite um domínio específico
          },
          
          {
            key: 'Access-Control-Allow-Origin',
            value: '*' // Substitua "*" por um domínio específico se possível https://sei-apresentacao.trf2.jus.br;http://localhost:3000
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
        ],
      },
    ];
  },
};

export default nextConfig;