'use client'

import { useRef, useState } from "react"
import { Button, Form } from "react-bootstrap"

export default function Print(params: { id: string, className: string, children?: any }) {
    const [html, setHtml] = useState('Testando...')
    const ref = useRef(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        window.print()

        // const printDiv = document.querySelector('#modjus-document')
        // const innerHTML = printDiv ? printDiv.innerHTML : ''
        // const printHtml = document.querySelector('#printHtml')
        // if (printHtml) {
        //     printHtml.setAttribute('value', innerHTML)
        // }
        // setHtml(document.documentElement.innerHTML)
        // const printForm = document.querySelector('#printForm') as HTMLFormElement
        // if (printForm) {
        //     printForm.submit()
        // }
    }

    return (
        <div className="h-print" style={{ height: '1em' }}>
            <Form id="printForm" className="float-end" action={`/api/pdf/${params.id}`} method="post" ref={ref} >
            <input id="printHtml" type="hidden" name="html" value={html} />
            <Button className={params.className} variant="primary" type="button" onClick={(e) => handleClick(e)}>Gerar o PDF</Button>
            </Form>
        </div>
    )
}