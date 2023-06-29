import { useContext } from "react";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { EditorContext } from "../Context";
import { BiBulb, BiFile, BiPlus } from "react-icons/bi";
import { INTRO_TEXT } from "../Intro";
import { FiUpload } from "react-icons/fi";
import { openFile } from "../File";
import { PersistedState } from "../usePersistedState";
import WhatsNew from "./WhatsNew";

const { hook: useViewedHelp } = PersistedState<string[]>("viewedHelp");

const QuickStart = () => {
  const { newNote } = useContext(EditorContext);
  const [viewedHelp, setViewedHelp] = useViewedHelp<string[]>([]);

  const handleOpen = async () => {
    const text = (await openFile()) as string;
    newNote({ text });
  };

  return (
    <>
      <WhatsNew viewed={viewedHelp} setViewed={setViewedHelp} />
      <div>
        <Title>Quick start</Title>
        <ListContainer>
          <List>
            <List.Item
              withIcon
              onClick={() =>
                newNote({
                  text: `# A title for the note\nWrite your mind here ...`,
                })
              }
            >
              <List.Item.Icon>
                <BiPlus />
              </List.Item.Icon>
              <span>New note</span>
            </List.Item>
            <List.Item
              withIcon
              className="last:mb-0"
              onClick={() => {
                newNote({
                  text: INTRO_TEXT,
                });
              }}
            >
              <List.Item.Icon>
                <BiFile />
              </List.Item.Icon>
              <span>Create sample note</span>
            </List.Item>
            <List.Item withIcon onClick={handleOpen}>
              <List.Item.Icon>
                <FiUpload />
              </List.Item.Icon>
              <span>Open .md</span>
            </List.Item>
            <List.Item withIcon onClick={() => setViewedHelp([])}>
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
