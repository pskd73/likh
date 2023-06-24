import { useContext } from "react";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { EditorContext } from "../Context";
import { BiFile, BiPlus } from "react-icons/bi";
import { INTRO_TEXT } from "../Intro";

const QuickStart = () => {
  const { newNote } = useContext(EditorContext);

  return (
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
        </List>
      </ListContainer>
    </div>
  );
};

export default QuickStart;
