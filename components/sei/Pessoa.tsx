import { useEffect, useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import styles from '@/PessoaMany.module.css';
import { Modal } from 'react-bootstrap';
import TableRecords from '../table-records';
import ErrorPopup from "@/app/components/ErrorPopup";

interface Orgao {
    idOrgao: string; // ID do órgão
    sigla: string;   // Sigla do órgão
    nome: string;    // Nome completo do órgão
}

// Carregar dados de pessoa do Siga-Doc
async function loadPessoa(texto: string) {
    try {
    const retorno = await fetch(`/api/siga-rest/pessoas?texto=${encodeURI(texto)}`);
    const json = await retorno.json();
    if (json.erro) {
        throw new Error("Houve um problema ao tentar buscar a lista de pessoas pesquisadas informada na sigla do Titular. Tente mais tarde. Caso o erro persista abra um chamado informando este erro.");
      }
      return json;
    } catch (error: any) {
        throw new Error("Houve um problema ao tentar buscar a lista de pessoas pesquisadas informada na sigla do Titular. Tente mais tarde. Caso o erro persista abra um chamado informando este erro.");
 } 
 }



interface PessoaProps {
    Frm: FormHelper;
    name: string;
    label1: string;
    label2: string;
}

type Pessoa = {
    sigla: string
    nome: string
    idOrgao: string
}

export default function PessoaMany({ Frm, name, label1, label2 }: PessoaProps) {
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [popupData, setPopupData] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');


    async function handleClick(Frm: FormHelper, name: string, setPopupData: (data: any[]) => void, setIsOpen: (data: boolean) => void, setError: (message: string) => void) {
        try {
        const sigla = Frm.data[name].sigla
        const json = await loadPessoa(sigla)
        
        if (!json.list) return

        const lista: Pessoa[] =
            json.list.map((u: any) => ({ sigla: u.sigla, nome: u.nome, idOrgao: u.lotacao.orgao.idOrgao } as Pessoa))
                .filter((item: Pessoa) => ['1', '2', '3'].includes(item.idOrgao))

        if (lista.length === 1) {
            const newData = { ...Frm.data };
            newData[name].sigla = lista[0].sigla;
            newData[name].descricao = lista[0].nome;
            if (Frm.setData) Frm.setData(newData);
        } else if (lista.length > 1) {
            setPopupData(lista)
            setIsOpen(true);
        }
           setError(""); // Clear any previous error
         } catch (error: any) {
           setError(error.message);
      }
    }

    const handleSelecionado = (s: string) => {
        const selectedItem = popupData.find(item => item.sigla === s);
        if (selectedItem) {
            const newData = { ...Frm.data };
            newData[name].sigla = selectedItem.sigla;
            newData[name].descricao = selectedItem.nome;
            if (Frm.setData) Frm.setData(newData);
        }
        setIsOpen(false);
    }

    return (
        <>
            <div className="col col-12">
                <div className="row">
                    <Frm.Input label={`${label1}`}   name={`${name}.sigla`} width={3} />
                    <Frm.Button onClick={() => handleClick(Frm, name, setPopupData, setIsOpen, setError)} >...</Frm.Button>
                    <Frm.Input label={`${label2}`} name={`${name}.descricao`} width={""} />
                </div>
                <div>  {error && <ErrorPopup message={error} onClose={() => setError("")} />}</div>

            </div>
          

            <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)} aria-labelledby="escolha-de-pessoa">
                <Modal.Header closeButton>
                    <Modal.Title>Escolha uma Pessoa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableRecords records={popupData} onSelecionado={handleSelecionado} spec="Pessoas" pageSize={10}/>
                </Modal.Body>
            </Modal>
        </>
    );
}
