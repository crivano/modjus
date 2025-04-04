export const transformArrayToJson = (array: { modjusData: string, numero_documento: string, data_assinatura: string, versao: string }[]): any[] => {
  return array.map(item => ({
    modjusData: JSON.parse(item.modjusData),
    numero_documento: item.numero_documento,
    data_assinatura: item.data_assinatura,
    versao: item.versao,
  }));
};
