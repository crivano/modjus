/** @type {import('next').NextConfig} */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url'; // Adicione esta linha


// Recria o comportamento de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url))
);

const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
const appVersion = packageJson.version;
const buildTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

// Cria um arquivo no diretório do projeto
const versionData = {
  version: appVersion,
  commit: gitCommitHash,
  buildTime,
};

const versionFilePath = resolve(__dirname, './', 'version.ts');

writeFileSync(
  versionFilePath,
  `export const VERSION = ${JSON.stringify(versionData, null, 2)};\n`
);

const allowedOrigin = process.env.ALLOWED_ORIGIN;

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
            value: `frame-ancestors 'self' ${allowedOrigin}`, // Substitui X-Frame-Options
          },
        ],
      },
    ];
  },
};

export default nextConfig;
