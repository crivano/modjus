import { useEffect, useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import styles from '@/PessoaMany.module.css';
import { Modal } from 'react-bootstrap';
import TableRecords from '../table-records';

interface Orgao {
    idOrgao: string; // ID do órgão
    sigla: string;   // Sigla do órgão
    nome: string;    // Nome completo do órgão
}

// Carregar dados de pessoa do Siga-Doc
async function loadPessoa(texto: string) {

    const retorno = await fetch(`/api/siga-rest/pessoas?texto=${encodeURI(texto)}`);
    const json = await retorno.json();
    return json;

    // Retorna apenas os itens que atendem ao critério

}



interface PessoaProps {
    Frm: FormHelper;
    name: string;
}

type Pessoa = {
    sigla: string
    nome: string
    idOrgao: string
}

export default function PessoaMany({ Frm, name }: PessoaProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [popupData, setPopupData] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');


    async function handleClick(Frm: FormHelper, name: string, setPopupData: (data: any[]) => void, setIsOpen: (data: boolean) => void) {
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
                    <Frm.Input label="Sigla " name={`${name}.sigla`} width={3} />
                    <Frm.Button onClick={() => handleClick(Frm, name, setPopupData, setIsOpen)} >...</Frm.Button>
                    <Frm.Input label="Nome" name={`${name}.descricao`} width={""} />
                </div>
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
