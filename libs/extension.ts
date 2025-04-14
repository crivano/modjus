import { decode } from 'html-entities'

export const decodeHtmlEntities = (obj: any): any => {
    if (typeof obj === 'string') {
        return decode(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(decodeHtmlEntities);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = decodeHtmlEntities(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj;
}

export const handleSave = () => {
    if (window.parent) {
        const modjusDocument = document.getElementById('modjus-document')?.outerHTML
        console.log('Conteúdo do div #modjus-document:', modjusDocument)
        window.parent.postMessage({ type: 'SAVE_DATA', payload: modjusDocument }, '*')
    }
}

export const handleSaveWithValidations = () => {
    if (window.parent) {
        const modjusDocument = document.getElementById('modjus-document')?.outerHTML;
        //console.log(modjusDocument);
        //console.log('Conteúdo do div #modjus-document:', modjusDocument);

        // Obtendo o valor de justificativa pelo label
        const parser = new DOMParser();
        const doc = parser.parseFromString(modjusDocument || '', 'text/html');
        const labelElement = Array.from(doc.querySelectorAll('label')).find(label => label.textContent?.trim() === 'Justificativa:');
        const labelElementEditar = Array.from(doc.querySelectorAll('label')).find(label => label.textContent?.trim() === 'editarConclusao:');

        const justificativaValue = labelElement?.nextElementSibling?.textContent?.trim();

        const editarConclusao = labelElementEditar?.nextElementSibling?.textContent?.trim();


        const array =  [
            'Não informado',
            '',
        ]

        if (editarConclusao == "sim"){
            if (justificativaValue && array.includes(justificativaValue)){
                alert('Justificativa não preenchida!')
            }
            else {
                window.parent.postMessage({ type: 'SAVE_DATA', payload: modjusDocument }, '*')  
            }
        } else {
            window.parent.postMessage({ type: 'SAVE_DATA', payload: modjusDocument }, '*')  
        }
        
    }
}