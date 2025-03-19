import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const DynamicListTrajetoV1 = ({ Frm, label, name, width }) => {
    const [trajeto, setTrajeto] = useState(Frm.get(`${name}`) || "");
    const [returnToOrigin, setReturnToOrigin] = useState(Frm.get(`${name}_returnToOrigin`) || false);
    const [trechos, setTrechos] = useState(Frm.get(`${name}_trechos`) || []);

    const transporteOptions = [
        { id: '1', name: 'Com adicional de deslocamento' },
        { id: '2', name: 'Sem adicional de deslocamento' },
        { id: '3', name: 'Veículo oficial' }
    ];

    const hospedagemOptions = [
        { id: '1', name: 'Sim' },
        { id: '2', name: 'Não' }
    ];

    useEffect(() => {
        const trajetoSalvo = Frm.get(`${name}`);
        const returnToOriginSalvo = Frm.get(`${name}_returnToOrigin`);
        const trechosSalvos = Frm.get(`${name}_trechos`);
    
        if (trajetoSalvo !== trajeto) setTrajeto(trajetoSalvo);
        if (returnToOriginSalvo !== returnToOrigin) setReturnToOrigin(returnToOriginSalvo);
        if (trechosSalvos !== trechos) setTrechos(trechosSalvos);
        updatetrechos(trajetoSalvo,  returnToOriginSalvo);
    }, [Frm, name, trajeto, returnToOrigin, trechos]);
    

    const handleTrajetoChange = (e) => {
        const newTrajeto = e.target.value;
        setTrajeto(newTrajeto);
        Frm.set(`${name}`, newTrajeto);
        updatetrechos(newTrajeto, returnToOrigin);
    };

    const handleReturnToOriginV1 = (checked) => {
        setReturnToOrigin(checked);
        Frm.set(`${name}_returnToOrigin`, checked);
        updatetrechos(Frm.get(`${name}`),  Frm.get(`${name}_returnToOrigin`));
    };

    const updatetrechos = (trajetoStr, returnToOrigin) => {
        if (!trajetoStr) {
            setTrechos([]); // Limpa os trechos se trajeto não for informado
            return;
        }

        const cidades = trajetoStr.split(" / ").map(c => c.trim());
        const newTrechos = [];

        for (let i = 0; i < cidades.length - 1; i++) {
            newTrechos.push({
                origem: cidades[i],
                destino: cidades[i + 1],
                transporteAteEmbarque: "1",
                transporteAposDesembarque: "1",
                hospedagem: "1",
                dataTrecho: ""
            });
        }

        if (returnToOrigin && cidades.length > 1) {
            newTrechos.push({
                origem: cidades[cidades.length - 1],
                destino: cidades[0],
                transporteAteEmbarque: "1",
                transporteAposDesembarque: "1",
                hospedagem: "1",
                dataTrecho: ""
            });
        }

        setTrechos(newTrechos); // Atualiza o estado dos trechos
        // Se necessário, você pode descomentar o Frm.set aqui para persistir os dados externamente
         Frm.set(`${name}_trechos`, newTrechos);
    };

    return Frm.setData ? (
        <div className={`col-${width || 12}`}>
            <Form.Group className="mb-3">
                <Form.Label><strong>{label}</strong></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Informe o trajeto (ex: RIO / SAO PAULO / BRASILIA)"
                    value={Frm.get(`${name}`) || ""}
                    onChange={handleTrajetoChange}
                />
            </Form.Group>

            <Form.Check
                type="checkbox"
                label="Retorno à origem"
                checked={Frm.get(`${name}_returnToOrigin`) || false}
                onChange={(e) => handleReturnToOriginV1(e.target.checked)}
            />

            {
                (trechos || []).map((trecho, index) => (
                    <div key={index} className="d-flex align-trechos-center mb-2">
                        <div className="flex-grow-1">
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Origem</Form.Label>
                                    <Form.Control type="text" value={trecho.origem} readOnly />
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Destino</Form.Label>
                                    <Form.Control type="text" value={trecho.destino} readOnly />
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Transporte até o embarque</Form.Label>
                                    <Form.Select
                                        value={trecho.transporteAteEmbarque}
                                        onChange={e => {
                                            const newTrechos = [...trechos];
                                            newTrechos[index].transporteAteEmbarque = e.target.value;
                                            setTrechos(newTrechos);
                                            // Atualiza externamente se necessário
                                             Frm.set(`${name}_trechos`, newTrechos);
                                        }}
                                    >
                                        {transporteOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Transporte após o desembarque</Form.Label>
                                    <Form.Select
                                        value={trecho.transporteAposDesembarque}
                                        onChange={e => {
                                            const newTrechos = [...trechos];
                                            newTrechos[index].transporteAposDesembarque = e.target.value;
                                            setTrechos(newTrechos);
                                            // Atualiza externamente se necessário
                                             Frm.set(`${name}_trechos`, newTrechos);
                                        }}
                                    >
                                        {transporteOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Data do Trecho</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={trecho.dataTrecho}
                                        onChange={e => {
                                            const newTrechos = [...trechos];
                                            newTrechos[index].dataTrecho = e.target.value;
                                            setTrechos(newTrechos);
                                            // Atualiza externamente se necessário
                                            Frm.set(`${name}_trechos`, newTrechos);
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-md-6">
                                    <Form.Label>Hospedagem custeada/fornecida por órgão da administração pública</Form.Label>
                                    <Form.Select
                                        value={trecho.hospedagem}
                                        onChange={e => {
                                            const newTrechos = [...trechos];
                                            newTrechos[index].hospedagem = e.target.value;
                                            setTrechos(newTrechos);
                                            // Atualiza externamente se necessário
                                            // Frm.set(`${name}_trechos`, newTrechos);
                                        }}
                                    >
                                        {hospedagemOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    ) : null;
};

export default DynamicListTrajetoV1;
