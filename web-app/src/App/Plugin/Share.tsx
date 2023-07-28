import { useContext, useState } from "react";
import { RNPluginCreator } from "./type";
import { EditorContext } from "../Context";
import List from "../List";
import { textToTitle } from "src/Note";
import { BiShare } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import Button from "src/comps/Button";

const Page = () => {
  const [search] = useSearchParams();
  const { usePluginState, allNotes } = useContext(EditorContext);
  const [state, setState] = usePluginState<{ num?: number }>("test2");
  const noteId = search.get("noteId");

  const inc = () => {
    setState({ num: (state?.num || 0) + 1 });
  };

  return (
    <div>
      {noteId && allNotes[noteId] && (
        <div className="space-y-2">
          <div>
            Sharing -{" "}
            <span className="font-bold">
              {textToTitle(allNotes[noteId].text)}
            </span>
          </div>
          <div className="space-x-2">
            <span>Are you sure?</span>
            <div className="space-x-2 inline-block">
              <Button>Yes</Button>
              <Button lite>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SharePlugin: RNPluginCreator = () => {
  return {
    name: "Share",
    version: 1,
    page: {
      url: "share",
      element: <Page />,
    },
    noteStatuBarIcons: {
      share: (note) => ({
        icon: <BiShare />,
        tooltop: "Share",
        onClick: (e, navigate) =>
          navigate(`/write/plugin/share?noteId=${note.id}`),
      }),
    },
  };
};

export default SharePlugin;
