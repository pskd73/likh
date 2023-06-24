import { EditorContext, NoteSummary } from "../Context";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { textToTitle } from "../../../Note";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { useContext } from "react";

const Todos = ({ summaries }: { summaries: NoteSummary[] }) => {
  const { setNote } = useContext(EditorContext);
  return (
    <div>
      <Title>Todos</Title>
      <ListContainer>
        <List>
          {summaries.map((summary, i) => (
            <List.Item withIcon key={i} onClick={() => setNote(summary.note)}>
              <List.Item.Icon>
                <MdRadioButtonUnchecked />
              </List.Item.Icon>
              <span>
                <span className="opacity-50">
                  [{summary.todo?.checked}/{summary.todo?.total}]{" "}
                </span>
                {textToTitle(summary.note.text, 20)}
              </span>
            </List.Item>
          ))}
        </List>
      </ListContainer>
    </div>
  );
};

export default Todos;
