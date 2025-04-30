import { NextRequest, NextResponse } from "next/server"; // Importando NextRequest para middleware
import mysql from "mysql2";
import { JSDOM } from "jsdom";
import { transformArrayToJson } from "@/components/utils/transformArrayToJson"; // Import the utility function

// Função para conectar ao banco de dados usando variáveis de ambiente
const getDatabaseConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST, // Host do banco de dados
    user: process.env.DB_USER, // Usuário do banco de dados
    password: process.env.DB_PASSWORD, // Senha do banco de dados
    database: process.env.DB_NAME, // Nome do banco de dados
  });
};

interface DocumentoConteudo {
  id_documento: number;
  id_serie: number;
  conteudo: string;
  protocolo_formatado: string;
  data_assinatura: string;
  versao;
}

// Função para verificar se o IP da requisição é permitido
const checkIP = (req: NextRequest): boolean => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(",") || [];

  console.log("Antes de pegar o Cabeçalho x-forwarded-for:");

  // Acessar o cabeçalho 'x-forwarded-for'
  const forwardedFor = req.headers.get("x-forwarded-for");
  console.log("Depois de Cabeçalho x-forwarded-for:", forwardedFor);

  // Se 'x-forwarded-for' não existir, utilizar 'req.ip'
  const requestIP = forwardedFor
    ? forwardedFor.split(",")[0].trim() // Pega o primeiro IP se houver mais de um
    : req.ip; // Fallback para o IP da conexão direta

  console.log("IP da requisição:", requestIP); // Log para depuração

  // Verifica se o IP da requisição está na lista de IPs permitidos
  return allowedIPs.includes(requestIP);
};

// Função para verificar a autenticação básica
const checkAuth = (req: NextRequest): boolean => {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return false; // Nenhuma autenticação fornecida
  }

  const [, encodedCredentials] = auth.split(" "); // Extrai o valor após "Basic "
  const credentials = Buffer.from(encodedCredentials, "base64").toString(
    "utf8"
  );
  const [username, password] = credentials.split(":");

  return (
    username === process.env.AUTH_USER && password === process.env.AUTH_PASS
  );
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Obter parâmetros de query da URL
      const nome_documento = decodeURIComponent(
      req.nextUrl.searchParams.get("nome_documento")
    );
    console.log("Nome Documento Decodificado:", nome_documento);

    // Verificar se os parâmetros são válidos
    if ( !nome_documento) {
      return NextResponse.json(
        { error: "Parâmetros nome_documento são obrigatórios." },
        { status: 400 }
      );
    }

    if (!checkIP(req)) {
      console.log("checkIP");
      return new NextResponse("Autenticação Inválida", {
        status: 403,
      });
    }

    // Verificação de autenticação básica
    if (!checkAuth(req)) {
      console.log("checkAuth");
      return new NextResponse("Autenticação Inválida", {
        status: 401,
      });
    }

    // Conectar ao banco de dados
    const connection = getDatabaseConnection();
    console.log("Conectou no Banco");

    // Realizar a consulta SQL para pegar todos os registros
    const [rows] = await new Promise<[DocumentoConteudo[]]>(
      (resolve, reject) => {
        connection.query(
          `SELECT a2.dth_abertura as data_assinatura, v.versao as versao, d.id_documento, p.protocolo_formatado, p2.protocolo_formatado, s.nome, dc.conteudo
            from sei.protocolo p
            JOIN sei.documento d ON d.id_procedimento = p.id_protocolo 
            JOIN sei.documento_conteudo dc ON d.id_documento = dc.id_documento 
            JOIN sei.protocolo p2 ON p2.id_protocolo = d.id_documento 
            JOIN sei.serie s ON s.id_serie = d.id_serie
            JOIN (
               SELECT a1.*
               FROM sei.assinatura a1
               INNER JOIN (
                   SELECT id_documento, MIN(id_assinatura) AS min_id_assinatura
                   FROM sei.assinatura 
                   WHERE sin_ativo = 'S'
                   GROUP BY id_documento
               ) a2 ON a1.id_documento = a2.id_documento AND a1.id_assinatura = a2.min_id_assinatura
            ) a ON d.id_documento = a.id_documento
            JOIN sei.atividade a2 ON a.id_atividade = a2.id_atividade
            JOIN sei.tarefa t ON t.id_tarefa = a2.id_tarefa
            JOIN (SELECT max(versao) as versao ,id_documento from sei.versao_secao_documento vsd
                        JOIN sei.secao_documento sd ON sd.id_secao_documento = vsd.id_secao_documento
                        group by id_documento 
            ) v on v.id_documento = d.id_documento 
            WHERE  UPPER(s.nome) = UPPER(?) 
            AND a.sin_ativo = 'S'  
            AND t.id_tarefa = 5`,

          [nome_documento],
          (err, results) => {
            if (err) reject(err);
            resolve([results as DocumentoConteudo[]]);
          }
        );
      }
    );

    console.log("Realizou a query");

    // Fechar a conexão com o banco
    connection.end();

    // Verificar se o resultado foi encontrado
    if (rows.length > 0) {
      // Array para armazenar os dados extraídos
      const modjusDataList: {
        modjusData: string;
        numero_documento: string;
        data_assinatura: string;
        versao: string;
      }[] = [];

      // Iterar sobre todos os registros e extrair o valor de 'modjus-data'
      rows.forEach((row) => {
        const htmlContent = row.conteudo; // Conteúdo HTML vindo do banco de dados

        // Criar o JSDOM a partir do conteúdo HTML obtido do banco
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;

        // Procurar o atributo 'modjus-data' na div com id 'modjus-document'
        const modjusData = document
          .querySelector("#modjus-document")
          ?.getAttribute("modjus-data");

        const numero_documento = row.protocolo_formatado;
        const data_assinatura = row.data_assinatura;  
        const versao = row.versao; // Adicionando a versão

        // Adicionar o valor encontrado ao array, se existir
        if (modjusData) {
          modjusDataList.push({
            modjusData,
            numero_documento,
            data_assinatura,
            versao,
          });
        }
  //      console.log("modjusData", modjusData);
  //      console.log("numero_documento", numero_documento); // Log para depuração
      });

      // Verificar se algum dado foi encontrado
      if (modjusDataList.length > 0) {
        const jsonData = transformArrayToJson(modjusDataList); // Transform the array of objects into JSON
        return new NextResponse(JSON.stringify(jsonData), { status: 200 });
      } else {
        return new NextResponse("Nenhum atributo modjus-data encontrado.", {
          status: 404,
        });
      }
    } else {
      return new NextResponse("Nenhum conteudo encontrado no banco de dados.", {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return new NextResponse("Erro ao processar solicitação.", {
      status: 500,
    });
  }
}
