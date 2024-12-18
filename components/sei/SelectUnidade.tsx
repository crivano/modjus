import { FormHelper } from "@/libs/form-support"
import { useEffect, useState } from "react";

async function loadUnidades() {
    const retorno = await fetch(`http://localhost:3000/api/sei-soap`)
    const json = await retorno.json()
    return json
}

export default function SelectUnidade({ Frm, name, width }: { Frm: FormHelper, name: string, width?: number | string }) {
    const [listaDeUnidades, setListaDeUnidades] = useState([] as { id: string, name: string }[])
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        async function fetchData() {
            const unidades = await loadUnidades()
            console.log('unidades', unidades)
            const unidadesMapeadas: { id: string, name: string }[] = unidades.map((u: any) => ({ id: `${u.sigla}: ${u.descricao}`, name: `${u.sigla}: ${u.descricao}` }))
            setListaDeUnidades([{ id: '', name: '' }, ...unidadesMapeadas])
            setLoading(false)
        }
        if (loading) fetchData()
    }, [])

    if (loading) return <Frm.SelectAutocomplete label="Unidade (carregando)" name={name + '_loading'} options={[]} width={width} />

    return <>
        <Frm.SelectAutocomplete label="Unidade" name={name} options={listaDeUnidades} width={12} />
    </>
}
