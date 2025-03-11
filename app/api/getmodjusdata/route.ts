import { NextRequest, NextResponse } from 'next/server';  // Importando NextRequest para middleware
import mysql from 'mysql2';
import { JSDOM } from 'jsdom';

// Função para conectar ao banco de dados usando variáveis de ambiente
const getDatabaseConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,         // Host do banco de dados
    user: process.env.DB_USER,         // Usuário do banco de dados
    password: process.env.DB_PASSWORD, // Senha do banco de dados
    database: process.env.DB_NAME,     // Nome do banco de dados
  });
};

interface DocumentoConteudo {
  id_documento: number;
  id_serie: number;
  conteudo: string;
}


// Função para verificar se o IP da requisição é permitido
const checkIP = (req: NextRequest): boolean => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];

  console.log("Antes de pegar o Cabeçalho x-forwarded-for:");
  
  // Acessar o cabeçalho 'x-forwarded-for'
  const forwardedFor = req.headers.get('x-forwarded-for');
  console.log("Depois de Cabeçalho x-forwarded-for:", forwardedFor);

  // Se 'x-forwarded-for' não existir, utilizar 'req.ip'
  const requestIP = forwardedFor
    ? forwardedFor.split(',')[0].trim() // Pega o primeiro IP se houver mais de um
    : req.ip;  // Fallback para o IP da conexão direta

  console.log("IP da requisição:", requestIP);  // Log para depuração

  // Verifica se o IP da requisição está na lista de IPs permitidos
  return allowedIPs.includes(requestIP);
};

// Função para verificar a autenticação básica
const checkAuth = (req: NextRequest): boolean => {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return false;  // Nenhuma autenticação fornecida
  }

  const [, encodedCredentials] = auth.split(' ');  // Extrai o valor após "Basic "
  const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  return username === process.env.AUTH_USER && password === process.env.AUTH_PASS;
};

// Função principal para lidar com GET requests
export async function GET(req: NextRequest) {
  try {
     if (!checkIP(req)) {
      console.log("checkIP");
      return new NextResponse('Autenticação Inválida', {
        status: 403
      });
    } 

    // Verificação de autenticação básica
    if (!checkAuth(req)) {
      console.log("checkAuth");
      return new NextResponse('Autenticação Inválida', {
        status: 401
      });
    }

    // Conectar ao banco de dados
    const connection = getDatabaseConnection();
    console.log("Conectou no Banco");

    // Realizar a consulta SQL para pegar todos os registros
    const [rows] = await new Promise<[DocumentoConteudo[]]>((resolve, reject) => {
      connection.query(
        'SELECT dc.id_documento, id_serie, conteudo FROM sei.documento_conteudo dc inner join sei.documento d on d.id_documento = dc.id_documento where id_serie = 1336', // Removendo o filtro para pegar todos os registros
        (err, results) => {
          if (err) reject(err);
          resolve([results as DocumentoConteudo[]]);
        }
      );
    });

    console.log("Realizou a query");

    // Fechar a conexão com o banco
    connection.end();

    // Verificar se o resultado foi encontrado
    if (rows.length > 0) {
      // Array para armazenar os dados extraídos
      const modjusDataList: string[] = [];

      // Iterar sobre todos os registros e extrair o valor de 'modjus-data'
      rows.forEach((row) => {
        const htmlContent = row.conteudo; // Conteúdo HTML vindo do banco de dados

        // Criar o JSDOM a partir do conteúdo HTML obtido do banco
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;

        // Procurar o atributo 'modjus-data' na div com id 'modjus-document'
        const modjusData = document.querySelector('#modjus-document')?.getAttribute('modjus-data');

        // Adicionar o valor encontrado ao array, se existir
        if (modjusData) {
          const cleanModjusData = modjusData.replace(/\\"/g, '"'); // Remove as barras invertidas extras
           modjusDataList.push(cleanModjusData);
        }
      });

      // Verificar se algum dado foi encontrado
      if (modjusDataList.length > 0) {
        return new NextResponse(JSON.stringify(modjusDataList), { status: 200 });
      } else {
        return new NextResponse('Nenhum atributo modjus-data encontrado.', {
          status: 404
        });
      }
    } else {
      return new NextResponse('Nenhum conteudo encontrado no banco de dados.', {
        status: 404
      });
    }
  } catch (error) {
    console.error('Erro ao processar a solicitação:', error);
    return new NextResponse('Erro ao processar solicitação.', {
      status: 500
    });
  }
}
