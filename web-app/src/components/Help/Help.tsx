import { useContext } from "react";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import { AppContext } from "../AppContext";
import TrayExpandIcon from "../TrayExpandIcon";

const Help = () => {
  const { trayOpen, setActiveTray, setTrayOpen } = useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("help");
    setTrayOpen(!trayOpen);
  };

  return (
    <div>
      <div className="p-4 overflow-y-scroll max-h-[90vh] scrollbar-hide">
        <div className="space-y-6 max-w-[800px]">
          <div>
            <h3 className="mb-1">
              1. What is Retro Note?
              <br />
              -----
            </h3>
            <p>
              Retro Note helps you in{" "}
              <span className="underline">
                building consistant writing habit
              </span>
              . It provides you a{" "}
              <span className="underline">
                clean, simple, and aesthetically pleasing note taking interface
              </span>
              . Providing a focused environment for writing is the top priority.
            </p>
          </div>

          <div>
            <h3 className="mb-1">
              2. Why not any other app?
              <br />
              -----
            </h3>
            <p>
              Most of the apps out there are not meant for focused writing. They
              come up with bunch of options, colors whcih{" "}
              <span className="underline">destract the author</span>. For
              example, Mac note app is to jot down quick thoughts but not meant
              for writing for long hours. Google Docs are meant for professional
              writing. They provide options for styling, correction etc. which
              are later stages of the writing as a process. Retro Note helps you
              in building the initial draft where you{" "}
              <span className="underline">
                peacefully sit and write for long hours without destractions
              </span>
              .
            </p>
          </div>

          <div>
            <h3 className="mb-1">
              3. Where are my notes stored?
              <br />
              -----
            </h3>
            <p>
              All the notes are stored on your{" "}
              <span className="underline">local PC</span>. They are currently
              not being transferred to the servers without your concern.
            </p>
          </div>
        </div>
      </div>

      <Toolbar className="bg-white">
        <Toolbar.Title>
          <Clickable>
            <span onClick={handleTitleClick}>
              <TrayExpandIcon />
              Help
            </span>
          </Clickable>
        </Toolbar.Title>
      </Toolbar>
    </div>
  );
};

export default Help;
