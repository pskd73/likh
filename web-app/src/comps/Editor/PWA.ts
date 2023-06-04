import { useEffect, useState } from "react";

let event: any = null;

export const usePWA = () => {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleBeforeInstall = (e: Event) => {
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
