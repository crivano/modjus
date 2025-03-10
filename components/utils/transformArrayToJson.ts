export const transformArrayToJson = (array: string[]): any[] => {
  return array.map(item => JSON.parse(item));
};
