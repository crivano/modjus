import { useState } from "react";
import { FormHelper } from "@/libs/form-support";
import ErrorPopup from "@/components/ErrorPopup";

// Carregar dados de CEP pelo viacep
async function loadCEP(cep: string) {
  const retorno = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const json = await retorno.json();
  if (json.erro) {
    throw new Error("CEP não encontrado");
  }
  return json;
}

async function handleClick(Frm: FormHelper, name: string, setError: (message: string) => void) {
  try {
    const cep = Frm.data[name].cep;
    const json = await loadCEP(cep);
    const newData = { ...Frm.data };
    newData[name].logradouro = json.logradouro;
    newData[name].bairro = json.bairro;
    newData[name].localidade = json.localidade;
    newData[name].uf = json.uf;
    if (Frm.setData) Frm.setData(newData);
    setError(""); // Clear any previous error
  } catch (error: any) {
    setError(error.message);
  }
}

export default function Endereco({ Frm, name }: { Frm: FormHelper; name: string }) {
  const [error, setError] = useState("");

  return (
    <>
      <Frm.Input label="CEP" name={`${name}.cep`} width={3} />
      <Frm.Button onClick={() => handleClick(Frm, name, setError)}>Buscar</Frm.Button>
      <Frm.Input label="Logradouro" name={`${name}.logradouro`} width={9} />
      <Frm.Input label="Número" name={`${name}.numero`} width={2} />
      <Frm.Input label="Complemento" name={`${name}.complemento`} width={2} />
      <Frm.Input label="Bairro" name={`${name}.bairro`} width={5} />
      <Frm.Input label="Localidade" name={`${name}.localidade`} width={5} />
      <Frm.Input label="UF" name={`${name}.uf`} width={2} />
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </>
  );
}
