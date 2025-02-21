import Link from 'next/link'

const tableSpecs = (pathname: string, onSelecionado: (s: string) => {}) => {
    return {
        Pessoas: {
            columns: [
                { header: 'Matrícula', accessorKey: 'official_at', enableSorting: true, style: { textAlign: "center", width: "15%" }, cell: (data: { row: { original: { sigla: string } } }) => <a href="#" onClick={() => onSelecionado(data.row.original.sigla)}>{data.row.original.sigla}</a> },
                { header: 'Nome', accessorKey: 'nome', enableSorting: true },
            ]
        },
        Unidades: {
            columns: [
                { header: 'Sigla', accessorKey: 'official_at', enableSorting: true, style: { textAlign: "center", width: "15%" }, cell: (data: { row: { original: { sigla: string } } }) => <a href="#" onClick={() => onSelecionado(data.row.original.sigla)}>{data.row.original.sigla}</a> },
                { header: 'Nome', accessorKey: 'nome', enableSorting: true },
            ]
        },
    }
}

export default tableSpecs

