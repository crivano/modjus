import { FormHelper } from "@/libs/form-support";

const QuantidadeServidoresTeletrabalho = ({ Frm, name }: { Frm: FormHelper, name: string }) => {
  const quantidade = Frm.get("t4QuantidadeDeServidoresEmTeletrabalho") || 0;
  const servidores = Frm.get(name) || [];

  const handleChange = (index: number, field: string, value: any) => {
    const newServidores = [...servidores];
    if (!newServidores[index]) {
      newServidores[index] = { nome: '', periodo: '', dataEnvio: '', numero: '' };
    }
    newServidores[index][field] = value;
    Frm.set(name, newServidores);
  };

  return (
    <>
      {Array.from({ length: quantidade }).map((_, i) => (
        <div className="row" key={i}>
          <Frm.Input label={i === 0 ? 'Nome do Servidor' : ''} name={`${name}[${i}].nome`} width={3} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, 'nome', e.target.value)} />
          <Frm.Input label={i === 0 ? 'Período' : ''} name={`${name}[${i}].periodo`} width={3} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, 'periodo', e.target.value)} />
          <Frm.dateInput label={i === 0 ? 'Data de Envio' : ''} name={`${name}[${i}].dataEnvio`} width={3} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, 'dataEnvio', e.target.value)} />
          <Frm.Input label={i === 0 ? 'Número' : ''} name={`${name}[${i}].numero`} width={3} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, 'numero', e.target.value)} />
        </div>
      ))}
    </>
  );
};

export default QuantidadeServidoresTeletrabalho;
