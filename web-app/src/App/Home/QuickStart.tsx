import { useContext } from "react";
import List from "src/App/List";
import { ListContainer, Title } from "src/App/Home/Common";
import { EditorContext } from "src/App/Context";
import { BiBulb, BiFile, BiPlus } from "react-icons/bi";
import {
  SAMPLE_JOURNALING,
  SAMPLE_MAIN,
  SAMPLE_MORE_TIPS,
  SAMPLE_SHORTCUTS,
} from "src/App/Intro";
import { FiUpload } from "react-icons/fi";
import { openFile } from "src/App/File";
import { PersistedState } from "src/App/usePersistedState";
import WhatsNew from "src/App/Home/WhatsNew";
import { useNavigate } from "react-router-dom";
import Event from "src/components/Event";

const { hook: useViewedHelp } = PersistedState<string[]>("viewedHelp");

const QuickStart = () => {
  const navigate = useNavigate();
  const { newNote } = useContext(EditorContext);
  const [viewedHelp, setViewedHelp] = useViewedHelp<string[]>([]);

  const handleOpen = async () => {
    const text = (await openFile()) as string;
    const note = newNote({ text });
    navigate(`/write/note/${note!.id}`);
  };

  const handleSampleNote = async () => {
    Event.track("sample_note");
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
    navigate(`/write/note/sample`);
  };

  const handleNewNote = () => {
    Event.track("new_note");
    const note = newNote({
      text: `# A title for the note\nWrite your mind here ...`,
    });
    navigate(`/write/note/${note!.id}`);
  };

  return (
    <>
      <WhatsNew viewed={viewedHelp} setViewed={setViewedHelp} />
      <div>
        <Title>Quick start</Title>
        <ListContainer>
          <List>
            <List.Item withIcon onClickKind={handleNewNote}>
              <List.Item.Icon>
                <BiPlus />
              </List.Item.Icon>
              <span>New note</span>
            </List.Item>
            <List.Item
              withIcon
              className="last:mb-0"
              onClickKind={handleSampleNote}
            >
              <List.Item.Icon>
                <BiFile />
              </List.Item.Icon>
              <span>Create sample note</span>
            </List.Item>
            <List.Item withIcon onClickKind={handleOpen}>
              <List.Item.Icon>
                <FiUpload />
              </List.Item.Icon>
              <span>Open .md</span>
            </List.Item>
            <List.Item withIcon onClickKind={() => setViewedHelp([])}>
              <List.Item.Icon>
                <BiBulb />
              </List.Item.Icon>
              <span>What's new?</span>
            </List.Item>
          </List>
        </ListContainer>
      </div>
    </>
  );
};

export default QuickStart;
