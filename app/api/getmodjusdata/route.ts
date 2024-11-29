import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
import { JSDOM } from 'jsdom';


interface DocumentoConteudo {
    id_documento: number;
    id_serie: number;
    conteudo: string;
  }

// Função para conectar ao banco de dados usando variáveis de ambiente
const getDatabaseConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,         // Host do banco de dados
    user: process.env.DB_USER,         // Usuário do banco de dados
    password: process.env.DB_PASSWORD, // Senha do banco de dados
    database: process.env.DB_NAME,     // Nome do banco de dados
  });
};

const checkIP = (req: NextApiRequest): boolean => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];

  // Acessar o cabeçalho 'x-forwarded-for'
  const forwardedFor = req.headers['x-forwarded-for'] as string | undefined;

  console.log("Cabeçalho x-forwarded-for:", forwardedFor);  // Adicione esse log para verificar o valor do cabeçalho

  // Se 'x-forwarded-for' não existir, utilizar 'req.socket?.remoteAddress'
  const requestIP = forwardedFor 
    ? forwardedFor.split(',')[0].trim() // Pega o primeiro IP se houver mais de um
    : req.socket?.remoteAddress;  // Fallback para o IP da conexão direta

  console.log("IP da requisição:", requestIP);  // Log para depuração

  // Verifica se o IP da requisição está na lista de IPs permitidos
  return allowedIPs.includes(requestIP as string);
};


// Função para verificar a autenticação básica
const checkAuth = (req: NextApiRequest): boolean => {
  const auth = req.headers['authorization'];
   console.log(auth);
  if (!auth) {
    return false;  // Nenhuma autenticação fornecida
  }

  const [, encodedCredentials] = auth.split(' ');  // Extrai o valor após "Basic "
  const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  return username === process.env.AUTH_USER && password === process.env.AUTH_PASS;
};

// Função principal da API
export  async function GET (req: NextApiRequest)  {
  try {
/* 
    // if (!checkIP(req)) {
    //     console.log("checkIP")
    //     return new Response('Autenticação Inválida', {
    //         status: 403
    //     })
    // } */

    // Verificação de autenticação básica
    if (!checkAuth(req)) {
           // // Verificação de IP console.log("checkAut")
        return new Response('Autenticação Inválida', {
            status: 401
        })
    }

    // Conectar ao banco de dados
    const connection = getDatabaseConnection();

    console.log("Conectou no Banco")

    // Realizar a consulta SQL para pegar todos os registros
    const [rows] = await new Promise<[DocumentoConteudo[]]>((resolve, reject) => {
      connection.query(
        'SELECT dc.id_documento, id_serie, conteudo FROM sei.documento_conteudo dc inner join sei.documento d on d.id_documento = dc.id_documento where id_serie = 1336', // Removendo o filtro para pegar todos os registros
        (err, results) => {
          if (err) reject(err);
          console.log(err)
          console.log(results)
          if (err) console.log(err)
            resolve([results as DocumentoConteudo[]])
        }
      );
    });

    console.log("Realizou a query")

    // Fechar a conexão com o banco
    connection.end();

    // Verificar se o resultado foi encontrado
    if (rows.length > 0) {
      // Array para armazenar os dados extraídos
      const modjusDataList: DocumentoConteudo[] = [];

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
          modjusDataList.push(modjusData);
        }
      });

      // Verificar se algum dado foi encontrado
      if (modjusDataList.length > 0) {
        return new Response(JSON.stringify(modjusDataList), { status: 200 });
       } else {
        return new Response('Nenhum atributo modjus-data encontrado.', {
            status: 404
        })
      }
    } else {
      return new Response('Nenhum conteudo encontrado no banco de dados.', {
        status: 404
    })
    }
  } catch (error) {
    console.error('Erro ao processar a solicitação:', error);
    return new Response('Erro ao processar solicitação.', {
      status: 404
  })
}
};

