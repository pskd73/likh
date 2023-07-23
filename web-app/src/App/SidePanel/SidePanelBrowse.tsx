import { useContext, useMemo } from "react";
import Browse from "../Home/Browse";
import { WithTitle } from "./Common";
import { EditorContext } from "../Context";

const SidePanelBrowse = () => {
  const { getHashtags, allNotes } = useContext(EditorContext);
  const hashtags = useMemo(getHashtags, [allNotes]);

  if (Object.keys(hashtags).length === 0) return null;

  return (
    <WithTitle title="Browse" active>
      <Browse />
    </WithTitle>
  );
};

export default SidePanelBrowse;
