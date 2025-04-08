'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState } from "react"


export default function RequisicaoPassagemAerea() {

  function interview(Frm: FormHelper) {
    return <>
        <div className="scrollableContainer">
            <Frm.Input label="Itinerário" name="itinerario" />
            <Frm.Input label="Nome do beneficiário" name="interessado" />
            <Frm.Input label="Grupo" name="grupo" />
        </div>
    </>
  }

  function document(data: any) {
    return <>
      <div className="scrollableContainer">
        <p>Sr. agente da AIRES TURISMO LTDA,</p>
        <p>De acordo com o disposto na Resolução nº 340/2015, do Conselho da Justiça Federal, requisito a V. Sª o fornecimento de passagens aéreas para o itinerário <strong>{data.itinerario || "Não informado"}</strong> em favor de <strong>{data.interessado || "Não informado"}</strong>, Grupo <strong>{data.grupo || "Não informado"}</strong>.</p>
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'Recomendacao 14 CJF' })
}
