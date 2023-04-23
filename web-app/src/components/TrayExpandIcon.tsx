import { useContext } from "react";
import { AppContext } from "./AppContext";

const TrayExpandIcon = () => {
  const { trayOpen } = useContext(AppContext);

  return (
    <span>
      {!trayOpen ? <span>[+]</span> : <span>[-]</span>}
      &nbsp;
    </span>
  );
};

export default TrayExpandIcon;
