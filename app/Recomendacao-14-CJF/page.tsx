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
    <Frm.CheckBoxes label="Opções 1" labelsAndNames={options.map(opt => ({ label: opt.name, name: `opcao1_${opt.name}` }))} />
    <Frm.CheckBoxes label="Opções 2" labelsAndNames={options.map(opt => ({ label: opt.name, name: `opcao2_${opt.name}` }))} />
    {JSON.stringify(Frm.data)}
  </>
}

function document(data: any) {
  return <>
    <p>Pessoa: {data.pessoa?.descricao}</p>
    <p>Opções 1:</p>
    <ul>
      {Object.keys(data).filter(key => key.startsWith('opcao1_') && data[key]).map(key => <li key={key}>{key.replace('opcao1_', '')}</li>)}
    </ul>
    <p>Opções 2:</p>
    <ul>
      {Object.keys(data).filter(key => key.startsWith('opcao2_') && data[key]).map(key => <li key={key}>{key.replace('opcao2_', '')}</li>)}
    </ul>
  </>
}
