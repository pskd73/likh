import { NoteSummary } from "src/App/Context";
import List from "src/App/List";
import { ListContainer, Title } from "src/App/Home/Common";
import { textToTitle } from "src/Note";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Todos = ({ summaries }: { summaries: NoteSummary[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Title>Todos</Title>
      <ListContainer>
        <List>
          {summaries.map((summary, i) => (
            <List.Item
              withIcon
              key={i}
              onClickKind={() => navigate(`/write/note/${summary.note.id}`)}
            >
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
