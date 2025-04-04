'use client'

import Model from "@/libs/model";
import { FormHelper } from "@/libs/form-support";
import { useState, useEffect } from "react";

export default function RequisicaoPassagemAerea() {
    const Frm = new FormHelper();
    const [itinerario, setItinerario] = useState("");
    const [nomeBeneficiario, setNomeBeneficiario] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [error, setError] = useState("");
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);

    async function fetchProcessData(numeroProcesso: string) {
        try {
          // 🔹 Faz a requisição para o backend Next.js
            const response = await axios.get<{ modjusData: any, numero_documento: string }[]>(
                '/api/getmodjus', {
                 params: { 
                     num_processo: numeroProcesso,
                     tipo_documento: "SOL" // Novo parâmetro
                 }
            }
          );
          setFetchedData(response.data);
          setSolicitacaoOptions([{ id: '', name: '' }, ...response.data.map((item: { modjusData: any, numero_documento: string }) => ({
            id: item.modjusData.id,
            name: item.numero_documento,
            data: item.modjusData // Store the entire data
          }))]);
        } catch (error) {
          setError('Não foi possível encontrar os dados adicionais');
        }
    }

    function handleSolicitacaoChange(event: React.ChangeEvent<HTMLSelectElement>, Frm: FormHelper) {
        try {
          if ((!event.target.value || event.target.value == '') && Frm.data && Frm.data.solicitacaoDeslocamento) {
            setSelectedSolicitacao(Frm.data.solicitacaoDeslocamento);
          } else if (!event.target.value || event.target.value == '') {
            setSelectedSolicitacao(null);
            new Error('Solicitação de deslocamento não encontrada');
          }
    
          setError('');
        } catch (error) {
          setError(error.message);
          return
        }
        try {
          const selectedId = event.target.value;
          const selected = solicitacaoOptions.find(option => option.name === selectedId);
          setSelectedSolicitacao(selected ? selected.data : null);
    
          if (selected) {
            const solicitacaoData = selected.data;
            // Se o beneficiário for Colaborador ou Colaborador Eventual, habilita os campos de valor diário
            if (solicitacaoData.tipoBeneficiario > '1') {
              Frm.set('nomeBeneficiario', solicitacaoData.nomePessoa || '')
            } else {
              Frm.set('nomeBeneficiario', solicitacaoData.pessoa?.descricao || '');
            }
            Frm.set('itinerario', solicitacaoData.trajeto || '');
          }
          setError('');
        } catch (error) {
          setError(error.message);
        }
      }

    function Interview(Frm: FormHelper) {
        useEffect(() => {
            if (Frm.data && Frm.data.processo && !dataFetched) {
              fetchProcessData(Frm.data.processo).then(() => {
                if (Frm.data.solicitacaoDeslocamento) {
                  handleSolicitacaoChange({ target: { value: Frm.data.solicitacaoDeslocamento } } as React.ChangeEvent<HTMLSelectElement>, Frm);
                }
                setDataFetched(true);
              });
            }
      
          });
          
        return (
            <div className="scrollableContainer">
                <h2>Requisição de Passagem Aérea</h2>
                <div className="row">
                    <Frm.Input label="Itinerário" name="itinerario" width={12} />
                    <Frm.Input label="Nome do Beneficiário" name="nomeBeneficiario" width={12} />
                    <Frm.Input label="Grupo" name="grupo" width={12} />
                </div>
            </div>
        );
    }

    function document(data: any) {
        return (
            <div className="scrollableContainer">
                <h4>Requisição de Passagem Aérea</h4>
                <p><strong>Itinerário:</strong> {data.itinerario || "Não informado"}</p>
                <p><strong>Nome do Beneficiário:</strong> {data.nomeBeneficiario || "Não informado"}</p>
                <p><strong>Grupo:</strong> {data.grupo || "Não informado"}</p>
            </div>
        );
    }

    return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'RequisicaoPassagemAerea' });
}
