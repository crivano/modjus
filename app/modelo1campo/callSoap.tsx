import { FormHelper } from "@/libs/form-support";
import { useState } from "react";
import ErrorPopup from "@/components/ErrorPopup";

// Carregar dados de CEP pelo viacep
async function handleClick(setError: (message: string) => void) {
  try {
    const retorno = await fetch('/api/soapServerAxio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!retorno.ok) {
      throw new Error(`Erro: ${retorno.status}`);
    }

    const json = await retorno.json();
    return json;
  } catch (error: any) {
    setError(error.message);
  }
}

export default function CallSoap({ Frm }: { Frm: FormHelper }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      <Frm.Button onClick={() => handleClick(setError)}>Buscar2</Frm.Button>
    </>
  );
}