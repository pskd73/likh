export function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function isWindows() {
  return navigator.platform.toUpperCase().indexOf("WIN") > -1;
}

export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export const isMobile = window.innerWidth < 500;

export const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone ||
  document.referrer.includes("android-app://");
