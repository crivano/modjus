import { useEffect, useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import styles from '@/PessoaMany.module.css';
import { Modal } from 'react-bootstrap';
import TableRecords from '../table-records';
import ErrorPopup from "@/components/ErrorPopup";


// Carregar dados de unidade do SEI
async function loadUnidade(texto: string) {
    try {
        const retorno = await fetch(`/api/sei-soap`);
        const json = await retorno.json();
        if (json.erro) {
            throw new Error("Houve um problema ao tentar buscar a lista de unidade pesquisadas informada na sigla da Unidade. Tente mais tarde. Caso o erro persista abra um chamado informando este erro.");
        }
        return json;
    } catch (error: any) {
        throw new Error("Houve um problema ao tentar buscar a lista de unidade pesquisadas informada na sigla da Unidade. Tente mais tarde. Caso o erro persista abra um chamado informando este erro.");
    }
}

interface UnidadeProps {
    Frm: FormHelper;
    name: string;

    onChange?: (unidade: any) => void;
}

type Unidade = {
    id: string
    sigla: string
    nome: string
}

export default function UnidadeMany({ Frm, name,  onChange}: UnidadeProps) {
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
            const json = await loadUnidade(sigla);

            if (json.erro) {
                throw new Error("Nenhuma unidade listada para a sigla informada");
            }
    

            const lista: Unidade[] =
                json.map((u: any) => ({ id : u.id, sigla: u.sigla, nome: u.descricao} as Unidade)).filter((item: Unidade) =>  item.sigla.includes(sigla) || item.nome.includes(sigla));

            if (lista.length === 1) {
                Frm.set(`${name}.sigla`, lista[0].sigla);
                Frm.set(`${name}.descricao`, lista[0].nome);
                if (onChange) {
                    onChange(lista[0]);
                }
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

            if (onChange) {
                onChange(selectedItem);
            }
        }
        setIsOpen(false);
    }

    return (
        <>
            <div className="col col-12">
                <div className="row">
                    <Frm.Input label='Sigla'   name={`${name}.sigla`} width={3} />
                    <Frm.Button onClick={() => handleClick(Frm, name, setPopupData, setIsOpen, setError)} >...</Frm.Button>
                    <Frm.Input label='Descrição' name={`${name}.descricao`} width={""} />
                </div>
                <div>  {error && <ErrorPopup message={error} onClose={() => setError("")} />}</div>

            </div>

            <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)} aria-labelledby="escolha-de-unidade">
                <Modal.Header closeButton>
                    <Modal.Title>Escolha uma Unidade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableRecords records={popupData} onSelecionado={handleSelecionado} spec="Unidades" pageSize={10} />
                </Modal.Body>
            </Modal>
        </>
    );
}
