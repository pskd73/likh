export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getNWords(text: string) {
  return text.replaceAll(/[\n ]+/g, " ").split(/[ \n]/).length;
}