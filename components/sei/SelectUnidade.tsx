import { FormHelper } from "@/libs/form-support"
import { useEffect, useState } from "react";
import ErrorPopup from "@/components/ErrorPopup";

async function loadUnidades() {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_URL_SEISOAP as string);
      const json = await response.json();
  
      // Verificação do erro dentro da resposta
      if (json.erro) {
        // Envia o log de erro para o servidor
         await logToServer('error: ' + json.error);
        throw new Error("Houve um problema ao tentar buscar a lista de unidades pesquisadas. Repita a operação. Caso o erro persista abra um chamado informando este erro.");
      }
  
      return json; // Retorna o json se não houver erro
    } catch (error: any) {
    // Envia o log de erro para o servidor
      await logToServer('error: ' + error.message);
      throw new Error("Houve um problema ao tentar buscar a lista de unidades pesquisadas. Repita a operação. Caso o erro persista abra um chamado informando este erro.");
    }
  }

  async function logToServer(logMessage: string) {
    try {
      // Envia o log para a API Route no servidor
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logMessage }),
      });
  
      const result = await response.json();
      console.log('Log enviado para o servidor:', result); // Log no client-side para saber que foi enviado
    } catch (error) {
      console.error('Erro ao enviar log para o servidor:', error);
    }
  }

export default function SelectUnidade({ Frm, name, width }: { Frm: FormHelper, name: string, width?: number | string }) {
   
    const [listaDeUnidades, setListaDeUnidades] = useState([] as { id: string, name: string }[])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");
    


    useEffect(() => { 
        async function fetchData() {
            try {
            const unidades = await loadUnidades()
            console.log('unidades', unidades)
            const unidadesMapeadas: { id: string, name: string }[] = unidades.map((u: any) => ({ id: `${u.sigla}: ${u.descricao}`, name: `${u.sigla}: ${u.descricao}` }))
            setListaDeUnidades([{ id: '', name: '' }, ...unidadesMapeadas])
            setLoading(false)
            setError(""); // Clear any previous error
        } catch (error: any) {
            setLoading(false)
            setError(error.message);
        }
        
        }
        if (loading) fetchData()
    }, [loading])

    if (loading) return <Frm.SelectAutocomplete label="Unidade (carregando)" name={name + '_loading'} options={[]} width={width} />


    return <>
        <Frm.SelectAutocomplete label="Unidade" name={name} options={listaDeUnidades} width={12} />
        <div>  {error && <ErrorPopup message={error} onClose={() => setError("")} />}</div>
    </>
}
