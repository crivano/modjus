'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import Endereco from "./Endereco"
import { Suspense, useState } from "react"
import PessoaMany from "@/components/sei/Pessoa"
import UnidadeMany from "@/components/sei/Unidade"

export default function Modelo1Campo() {
  return (<Suspense>{Model(interview, document)}</Suspense>)
}

function interview(Frm: FormHelper) {
  // const options = [{ id: "1", name: 'SP' }, { id: "2", name: 'RJ' }]
  const options = "RJ;SP;MG".split(';').map((uf, idx) => ({ id: `${idx + 1}`, name: uf }))

  const oCaracteristicas = [
    { label: 'Turma Recursal', name: 'turmaRecursal' },
    { label: 'Juizado Especial Federal', name: 'jef' },
    { label: 'Criminal', name: 'criminal' },
    { label: 'Execução Fiscal', name: 'execucaoFiscal' }
  ]

  const textoCodificado = "Esta unidade manteve sua compet&ecirc;ncia material para processar e julgar execu&ccedil;&atilde;o fiscal, bem como, as a&ccedil;&otilde;es de impugna&ccedil;&atilde;o dela decorrentes (art. 38 da Lei n&ordm; 6.830/80), nos termos do art. 24 da Resolu&ccedil;&atilde;o n&ordm; 21, de 08/07/2016, do TRF da 2&ordf; Regi&atilde;o.";

 
  return <>
    <Frm.Input label="Qual é o texto?" name="texto" width={6} />
    <Frm.SelectAutocomplete label="UF" name="uf" options={options} width={6} />

    <Endereco Frm={Frm} name="endereco" />

    <PessoaMany Frm={Frm} label1="sigla" label2="sigla2" name="pessoa"/>

    <UnidadeMany Frm={Frm}  name="unidade"/>

    <Frm.TextArea label="Qual é o texto1?" name="texto1" />

    {JSON.stringify(Frm.data)}
  </>
}

function document(data: any) {
  return <>
    <p>O texto  {data.texto}.</p>
    <p>O texto 1: {data.texto1}.</p>
    <p>A UF: {data.uf}.</p>
    {data.uf === '1'
      ? <div>
        <p>Estado de RJ</p>
      </div>
      : null}
  </>
}

function decode(textoCodificado: string) {
  throw new Error("Function not implemented.")
}

