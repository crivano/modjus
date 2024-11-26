'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { handleSave } from '@/libs/extension'
import { EMPTY_FORM_STATE, FormHelper } from '@/libs/form-support'
import Print from '@/components/print'

const Frm = new FormHelper()

export default function Model(interview: (Frm: FormHelper) => JSX.Element, document: (data: any) => JSX.Element, options?: { saveButton?: boolean, pdfButton?: boolean, pdfFileName: string }) {
    const searchParams = useSearchParams()
    console.log('searchParams', JSON.stringify(searchParams))
    const currentUrl = searchParams.get('url') ? searchParams.get('url') as string : (process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_VERCEL_URL) + usePathname()
    // const initialData = searchParams.get('data') ? JSON.parse(searchParams.get('data') as string) : {}
    const dataKey = searchParams.get('dataKey')
    const [data, setData] = useState({})
    Frm.update(data, setData, EMPTY_FORM_STATE)

    useEffect(() => {
        if (dataKey) {
            fetch(`/api/data-store?key=${dataKey}`)
                .then(response => response.json())
                .then(fetchedData => {
                    setData(fetchedData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        }
    }, [dataKey])
    
    return (<div>
        <div className="container-fluid">
            <div className="content mt-3">
                <div className="row">
                    <div id="modjus-interview" className="col col-12 col-md-6">
                        <h1 className="mt-3">Formulário</h1>
                        <div className="alert alert-info">
                            <div className="row">
                                {interview(Frm)}
                            </div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6">
                        <h1 className="mt-3">Previsão do Documento</h1>
                        <div className="alert alert-warning">
                            <div id="modjus-document" modjus-data={JSON.stringify(data)} modjus-url={currentUrl}>
                                {document(data)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {options?.pdfButton && <Print id={options?.pdfFileName} className="btn btn-primary mt-3 mb-3" />}
            {(!options || !options.pdfButton || options?.saveButton) && <button className="btn btn-primary mt-3 mb-3" onClick={handleSave}>Salvar</button>}
        </div>
    </div>
    );
}
