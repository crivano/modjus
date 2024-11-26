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