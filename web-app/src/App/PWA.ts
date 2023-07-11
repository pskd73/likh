import { useEffect, useState } from "react";

let event: any = null;
let cb: any = null;

const handleBeforeInstall = (e: Event) => {
  event = e;
  if (cb) {
    cb(e);
  }
};

window.addEventListener("beforeinstallprompt", handleBeforeInstall);

export const usePWA = () => {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    cb = _handleBeforeInstall;
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    if (event) {
      setInstallable(true);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const _handleBeforeInstall = (e: Event) => {
    event = e;
    setInstallable(true);
  };

  const install = async () => {
    if (event) {
      event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === "accepted") {
        event = null;
      }
    }
  };

  return {
    event,
    install,
    installable,
  };
};
