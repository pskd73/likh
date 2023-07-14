import { useContext, useMemo } from "react";
import Browse from "../Home/Browse";
import { isMobile } from "../device";
import { WithTitle } from "./Common";
import { EditorContext, NoteSummary } from "../Context";

const SidePanelBrowse = () => {
  const { setSideBar, getHashtags, notesToShow, note } =
    useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  if (Object.keys(hashtags).length === 0) return null;

  return (
    <WithTitle title="Browse" active>
      <Browse onNoteClick={() => isMobile && setSideBar(undefined)} />
    </WithTitle>
  );
};

export default SidePanelBrowse;
