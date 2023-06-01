import { useEffect } from "react";
import EditorWindow from "./comps/Editor/Window";
import Event from "./components/Event";

const Write = () => {
  useEffect(() => {
    Event.track("open_write");
  }, []);

  return <EditorWindow />;
};

export default Write;
