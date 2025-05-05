import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export async function GET() {
  try {

    // Checa se o ambiente é de produção
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        message: 'As informações de versão estão disponíveis apenas em produção.',
      });
    }
    
    // Obtém informações de versão, commit e horário de build
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    const appVersion = packageJson.version;
    const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const buildTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return NextResponse.json({
      version: appVersion,
      commit: gitCommitHash,
      buildTime,
    });
  } catch (error) {
    console.error('Error fetching version info:', error);
    return NextResponse.json({ error: 'Failed to fetch version info' }, { status: 500 });
  }
}
