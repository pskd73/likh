import List from "src/App/List";
import { ListContainer, Title } from "src/App/Home/Common";
import { textToTitle } from "src/Note";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "../type";

export type TodoNote = {
  note: SavedNote;
  checked: number;
  total: number;
}

const Todos = ({ todos }: { todos: TodoNote[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Title>Todos</Title>
      <ListContainer>
        <List>
          {todos.map((todo, i) => (
            <List.Item
              withIcon
              key={i}
              onClickKind={() => navigate(`/write/note/${todo.note.id}`)}
            >
              <List.Item.Icon>
                <MdRadioButtonUnchecked />
              </List.Item.Icon>
              <span>
                <span className="opacity-50">
                  [{todo.checked}/{todo.total}]{" "}
                </span>
                {textToTitle(todo.note.text, 20)}
              </span>
            </List.Item>
          ))}
        </List>
      </ListContainer>
    </div>
  );
};

export default Todos;
