import ErrorPopup from "@/components/ErrorPopup"

const juizDesembargadorIds = [
  4695, 4696, 5695, 6500, 7298, 7323, 8133, 8145, 8215, 8224, 8239, 8271, 8329, 8371, 5399, 6648, 8227, 9149, 9774, 8282, 8244
];

export function verificaJuizDesembargador(id: string) {
  if (juizDesembargadorIds.includes(Number(id))) {
    return true;
  }else{
    return false;
  }
}
