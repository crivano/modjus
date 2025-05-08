'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { decodeHtmlEntities, handleSave } from '@/libs/extension'
import { EMPTY_FORM_STATE, FormHelper } from '@/libs/form-support'
import Print from '@/components/print'
import { VERSION } from "@/version"; // Ajuste o caminho conforme necessário

const Frm = new FormHelper()

export default function Model(interview: (Frm: FormHelper) => JSX.Element, document: (data: any) => JSX.Element, options?: { saveButton?: boolean, pdfButton?: boolean, pdfFileName: string }) {
    const searchParams = useSearchParams()
    console.log('searchParams', JSON.stringify(searchParams))
    const currentUrl = searchParams.get('url') ? searchParams.get('url') as string : (process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_VERCEL_URL) + usePathname()
    // const initialData = searchParams.get('data') ? JSON.parse(searchParams.get('data') as string) : {}
    const dataKey = searchParams.get('dataKey')
    const [data, setData] = useState({})
    Frm.update(data, setData, EMPTY_FORM_STATE)

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Monitora o tamanho da janela
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerHeight < 900);
        };

        // Verifica o tamanho inicial
        handleResize();

        // Adiciona o listener para redimensionamento
        window.addEventListener('resize', handleResize);

        // Remove o listener ao desmontar o componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (dataKey) {
            fetch(`/api/data-store?key=${dataKey}`)
                .then(response => response.json())
                .then(fetchedData => {
                    fetchedData = decodeHtmlEntities(fetchedData)
                    setData(fetchedData)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        }
    }, [dataKey])

    Build: { new Date(VERSION.buildTime).toLocaleString('pt-BR') }

    return (<div>
        <div className="container-fluid">
            <footer style={{ marginTop: "20px", textAlign: "right", fontSize: "12px", color: "#888" }}>
                Versão: {VERSION.version} | Commit: {VERSION.commit} | Build: {VERSION.buildTime}
            </footer>

            <div className="row">
                <div id="modjus-interview" className="col col-12 col-md-6">
                    <div className="row">
                        <div className="col">
                            <h3 className="mt-3">Formulário</h3>
                        </div>
                        <div className="col">
                            {isSmallScreen && (
                                <div className="d-flex justify-content-end mt-2">
                                    {(!options || options.saveButton !== false) && (
                                        <button className="btn btn-primary" onClick={handleSave}>
                                            Transportar
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="alert alert-info">
                        <div className="row">
                            {interview(Frm)}
                        </div>
                    </div>
                    {!isSmallScreen && (
                        <div className="d-flex justify-content-end mt-2 mb-2">
                            {(!options || options.saveButton !== false) && (
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Transportar
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="col col-12 col-md-6">
                    <h3 className="mt-3">Previsão do Documento</h3>
                    <div className="alert alert-warning">
                        <div id="modjus-document" modjus-data={JSON.stringify(data)} modjus-url={currentUrl}>
                            {document(data)}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                        {options?.pdfButton && <Print id={options?.pdfFileName} className="btn btn-primary" />}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
