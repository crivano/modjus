
export const formatCPF = (value: string) => {
    const numericValue = value?.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value) {
        return numericValue
            .replace(/^(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona o segundo ponto
            .replace(/\.(\d{3})(\d)/, '.$1-$2') // Adiciona o hífen
            .slice(0, 14); // Limita o tamanho ao formato de CPF
    }
};

// FUNÇÃO PARA FORMATAR O CAMPO DE DINHEIRO
function limparNumeros(valor: string): string {
    return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
}

export const formatCurrency = (value: number | string | undefined) => {

    if (value === undefined || value === '') return '0,00';
    if (typeof value === 'string') {
        value = limparNumeros(value);
        value = parseFloat(value);
        value /= 100;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// FUNÇÃO PARA FORMATAR OS CAMPOS DO FORMULÁRIO
export function formatForm(name: string, field: any) {
    return <>
        <label>{name}</label>
        <span style={{ color: 'blue' }}>{' ' + field || "0,00"}</span>
        <br></br>
    </>
}
