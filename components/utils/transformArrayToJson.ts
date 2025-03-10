export const transformArrayToJson = (array: { modjusData: string, numero_documento: string }[]): any[] => {
  return array.map(item => ({
    modjusData: JSON.parse(item.modjusData),
    numero_documento: item.numero_documento
  }));
};
