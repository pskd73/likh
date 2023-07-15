import { useContext } from "react";
import {
  SAMPLE_JOURNALING,
  SAMPLE_MAIN,
  SAMPLE_MORE_TIPS,
  SAMPLE_SHORTCUTS,
} from "./Intro";
import { EditorContext } from "./Context";

const useSampleNote = () => {
  const { newNote } = useContext(EditorContext);

  const createSampleNotes = () => {
    newNote({
      text: SAMPLE_JOURNALING,
      id: "sample_journaling",
    });
    newNote({
      text: SAMPLE_MORE_TIPS,
      id: "sample_tips",
    });
    newNote({
      text: SAMPLE_SHORTCUTS,
      id: "sample_shortcuts",
    });
    newNote({
      text: SAMPLE_MAIN,
      id: "sample",
    });
    return "sample";
  };

  return { createSampleNotes };
};

export default useSampleNote;
