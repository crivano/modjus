
export const getOptionName = (options: { id: string, name: string }[], id: string) => {
    return options.find(opt => opt.id === id)?.name || 'Não informado';
};

export async function fetchProcessData(numeroProcesso: string) {
    try {
        // 🔹 Faz a requisição para o backend Next.js
        const response = await axios.get<{ modjusData: any, numero_documento: string }[]>(
            '/api/getmodjus', {
            params: {
                num_processo: numeroProcesso,
                tipo_documento: "CAL" // Novo parâmetro
            }
        }
        );

        // 🔹 Atualiza os estados com os dados recebidos
        setFetchedData(response.data);
        setSolicitacaoOptions([
            { id: '', name: '' },
            ...response.data.map((item) => ({
                id: item.modjusData.id,
                name: item.numero_documento,
                data: item.modjusData // Armazena os dados completos
            }))
        ]);
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        alert('Não foi possível encontrar os dados adicionais');
    }
}
