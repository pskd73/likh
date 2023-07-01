import { useContext, useState } from "react";
import { EditorContext } from "../Context";
import TextCounter from "./TextCounter";
import Button from "../../Button";
import {
  BiCheckShield,
  BiError,
  BiFullscreen,
  BiHomeSmile,
  BiLoaderAlt,
  BiSave,
  BiSpreadsheet,
} from "react-icons/bi";
import { saveNote } from "../File";
import Delete from "./Delete";
import classNames from "classnames";
import { PouchContext } from "../PouchDB";

const SyncIcon = ({ state }: { state: string }) => {
  if (state === "paused" || state === "init") {
    return <BiCheckShield />;
  }
  if (state === "error" || state === "denied") {
    return <BiError />;
  }
  return <BiLoaderAlt className="animate-spin" />;
};

const StatusBar = ({
  height,
  padding,
}: {
  height: number;
  padding: number;
}) => {
  const { syncState } = useContext(PouchContext);
  const { showStats, note, sideBar, setSideBar, isRoll, home } =
    useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const handleSave = () => {
    if (note) {
      saveNote(note);
    }
  };

  const handleFullScreen = () => {
    const elem = document.documentElement as any;
    if (fullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        /* Safari */
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        /* IE11 */
        (document as any).msExitFullscreen();
      }
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    }
    setFullScreen((f) => !f);
  };

  return (
    <div
      className={classNames(
        "bottom-0 w-full right-0 z-10 flex justify-between items-center",
        "bg-base shadow-2xl border-t border-primary border-opacity-10"
      )}
      style={{ height: height + padding, paddingBottom: padding }}
    >
      {/* Left */}
      <div className="flex justify-start h-full">
        <Button
          lite={sideBar !== "storage"}
          className="rounded-none"
          onClick={() =>
            setSideBar((b) => (b === "storage" ? undefined : "storage"))
          }
        >
          <SyncIcon state={syncState} />
        </Button>
      </div>

      {/* Right */}
      <div className="flex justify-end h-full">
        {note && !isRoll && <Delete />}
        {note && (
          <Button className="rounded-none" lite onClick={handleSave}>
            <BiSave />
          </Button>
        )}
        {showStats && note && <TextCounter text={note.text} />}
        <Button
          lite={!fullScreen}
          className="rounded-none"
          onClick={handleFullScreen}
        >
          <BiFullscreen />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
