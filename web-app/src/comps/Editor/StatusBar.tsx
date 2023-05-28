import { useContext } from "react";
import { EditorContext } from "./Context";
import TextCounter from "./TextCounter";

const StatusBar = ({ text }: { text: string }) => {
  const { showStats } = useContext(EditorContext);
  return (
    <div className="fixed bottom-0 w-full right-0 z-10 flex justify-end p-1">
      {showStats && <TextCounter text={text} />}
    </div>
  );
};

export default StatusBar;
