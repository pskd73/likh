import { useContext, useEffect } from "react";
import { EditorContext } from "./Context";
import { useNavigate } from "react-router-dom";
import useSampleNote from "./useSampleNote";

const Init = () => {
  const { initiated, setInitiated } = useContext(EditorContext);
  const { createSampleNotes } = useSampleNote();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initiated) {
      const noteId = createSampleNotes();
      setInitiated(true);
      navigate(`/write/note/${noteId}`);
      return;
    }
    navigate("/write");
  }, [initiated]);

  return null;
};

export default Init;
