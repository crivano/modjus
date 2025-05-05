import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export async function GET() {
  try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const appVersion = packageJson.version;
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
