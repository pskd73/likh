export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getNWords(text: string) {
  return text.replaceAll(/[\n ]+/g, " ").split(/[ \n]/).length;
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}