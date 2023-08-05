import { ComponentProps, useContext, useMemo, useState } from "react";
import { EditorContext } from "src/App/Context";
import TextCounter from "src/App/StatusBar/TextCounter";
import BaseButton from "src/comps/Button";
import {
  BiCheckShield,
  BiError,
  BiFullscreen,
  BiLoaderAlt,
  BiSave,
  BiSidebar,
} from "react-icons/bi";
import { BsInputCursorText } from "react-icons/bs";
import { saveNote } from "src/App/File";
import Delete from "src/App/StatusBar/Delete";
import classNames from "classnames";
import { PouchContext } from "src/App/PouchDB";
import { isMobile } from "src/App/device";
import { twMerge } from "tailwind-merge";
import Tooltip from "src/comps/Tooltip";
import { getShortcutText } from "../useShortcuts";
import moment from "moment";
import CreatedTime from "./CreatedTime";
import { useNavigate } from "react-router-dom";
import { PluginContext } from "../Plugin/Context";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";

const SyncIcon = ({ state }: { state: string }) => {
  if (state === "paused" || state === "init") {
    return <BiCheckShield />;
  }
  if (state === "error" || state === "denied") {
    return <BiError />;
  }
  return <BiLoaderAlt className="animate-spin" />;
};

const Button = ({
  children,
  className,
  ...restProps
}: ComponentProps<"button"> & { lite: boolean }) => {
  return (
    <BaseButton {...restProps} className={twMerge(className, "md:text-lg")}>
      {children}
    </BaseButton>
  );
};

const StatusBar = ({
  height,
  padding,
}: {
  height: number;
  padding: number;
}) => {
  const { syncState } = useContext(PouchContext);
  const {
    showStats,
    note,
    sideBar,
    setSideBar,
    isRoll,
    storage,
    setTypewriterMode,
    typewriterMode,
  } = useContext(EditorContext);
  const { plugins } = useContext(PluginContext);
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const pluginBtns = useMemo(() => {
    const btns = Object.values(plugins)
      .map((p) => p.statusBarIcons)
      .filter((icons) => icons?.length)
      .reduce((p, c) => [...p!, ...c!], []);
    return btns || [];
  }, [plugins]);

  const handleSave = () => {
    if (note) {
      saveNote(note, storage.pouch);
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
        "w-full right-0 z-30 flex justify-between items-center",
        "bg-base shadow-2xl border-t border-primary border-opacity-10",
        "absolute bottom-0"
      )}
      style={{ height: height + padding, paddingBottom: padding }}
    >
      {/* Left */}
      <div className="flex justify-start h-full">
        {isMobile && (
          <Tooltip tip={"Sidemenu"}>
            <Button
              lite={sideBar !== "storage"}
              className="rounded-none"
              onClick={() =>
                setSideBar((b) => (b === "outline" ? undefined : "outline"))
              }
            >
              <BiSidebar />
            </Button>
          </Tooltip>
        )}
        <Tooltip direction="top" tip={"Sync"}>
          <Button
            lite={sideBar !== "storage"}
            className="rounded-none"
            onClick={storage.pouch.sync}
          >
            <SyncIcon state={syncState} />
          </Button>
        </Tooltip>
        <CreatedTime />
      </div>

      {/* Right */}
      <div className="flex justify-end h-full">
        {note && !isRoll && <Delete />}
        {pluginBtns.map((btn, i) => (
          <React.Fragment key={i}>{btn}</React.Fragment>
        ))}
        {note && (
          <Tooltip
            tip={
              <span>
                Save<Tooltip.Shortcut>{getShortcutText("S")}</Tooltip.Shortcut>
              </span>
            }
            direction="top"
          >
            <Button className="rounded-none" lite onClick={handleSave}>
              <BiSave />
            </Button>
          </Tooltip>
        )}

        {note && !isRoll && (
          <Tooltip
            tip={
              typewriterMode ? "Typewriter mode: ON" : "Typewriter mode: OFF"
            }
          >
            <Button
              className="rounded-none"
              lite={!typewriterMode}
              onClick={() => setTypewriterMode((t) => !t)}
            >
              <BsInputCursorText />
            </Button>
          </Tooltip>
        )}

        {showStats && note && <TextCounter text={note.text} />}

        <Tooltip tip={"Fullscreen"}>
          <Button
            lite={!fullScreen}
            className="rounded-none hidden md:block"
            onClick={handleFullScreen}
          >
            <BiFullscreen />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default StatusBar;
