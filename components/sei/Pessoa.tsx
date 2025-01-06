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
}

type Pessoa = {
    sigla: string
    nome: string
    idOrgao: string
    cargo: string
    siglaUnidade: string
}

export default function PessoaMany({ Frm, name }: PessoaProps) {
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [popupData, setPopupData] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');

    async function handleClick(Frm: FormHelper, name: string, setPopupData: (data: any[]) => void, setIsOpen: (data: boolean) => void, setError: (message: string) => void) {
        try {
            const sigla = Frm.get(name)?.sigla;
            if (!sigla) {
                throw new Error("Sigla não informada");
            }
            const json = await loadPessoa(sigla);

            if (!json.list) return;

            const lista: Pessoa[] =
                json.list.map((u: any) => ({ sigla: u.sigla, nome: u.nome, idOrgao: u.lotacao.orgao.idOrgao, cargo: u.funcaoConfianca.nome, siglaUnidade: u.lotacao.sigla} as Pessoa))
                    .filter((item: Pessoa) => ['1', '2', '3'].includes(item.idOrgao));

            if (lista.length === 1) {
                Frm.set(`${name}.sigla`, lista[0].sigla);
                Frm.set(`${name}.descricao`, lista[0].nome);
                Frm.set(`${name}.cargo`, lista[0].cargo);
                Frm.set(`${name}.siglaUnidade`, lista[0].cargo);
            } else if (lista.length > 1) {
                setPopupData(lista);
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
            Frm.set(`${name}.sigla`, selectedItem.sigla);
            Frm.set(`${name}.descricao`, selectedItem.nome);
        }
        setIsOpen(false);
    }

    return (
        <>
            <div className="col col-12">
                <div className="row">
                    <Frm.Input label="Sigla " name={`${name}.sigla`} width={3} />
                    <Frm.Button onClick={() => handleClick(Frm, name, setPopupData, setIsOpen, setError)} >...</Frm.Button>
                    <Frm.Input label="Nome" name={`${name}.descricao`} width={""} />
                </div>
                {error && <ErrorPopup message={error} onClose={() => setError("")} />}
            </div>

            <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)} aria-labelledby="escolha-de-pessoa">
                <Modal.Header closeButton>
                    <Modal.Title>Escolha uma Pessoa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableRecords records={popupData} onSelecionado={handleSelecionado} spec="Pessoas" pageSize={10} />
                </Modal.Body>
            </Modal>
        </>
    );
}
