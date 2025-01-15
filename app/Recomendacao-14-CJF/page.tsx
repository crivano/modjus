'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { Suspense } from "react"
import PessoaMany from "@/components/sei/Pessoa"

export default function Recomendacao14CJF() {
  return (<Suspense>{Model(interview, document)}</Suspense>)
}

function interview(Frm: FormHelper) {
  const options = "a;b;c;d;e;f".split(';').map((opt, idx) => ({ id: `${idx + 1}`, name: opt }))

  return <>
    <PessoaMany Frm={Frm} name="pessoa" label1="Sigla" label2="Nome" />
    <Frm.RadioButtons label="01) Nos meses de Outubro a Dezembro de 2024, declaro a realização de:" name="opcao1" options={options} />
    <Frm.RadioButtons label="02) Nos meses de Outubro a Dezembro de 2024, declaro que, nos termos do art. 3º do Provimento nº TRF2-PVC-2023/00002, de 02 de fevereiro de 2023:
" name="opcao2" options={options} />
    {JSON.stringify(Frm.data)}
  </>
}

function document(data: any) {
  return <>
    <p>Pessoa: {data.pessoa?.descricao}</p>
    <p>Opções 1: {data.opcao1}</p>
    <p>Opções 2: {data.opcao2}</p>
  </>
}
