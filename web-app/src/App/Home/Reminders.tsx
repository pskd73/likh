import { BiAlarmExclamation, BiFile } from "react-icons/bi";
import { textToTitle } from "src/Note";
import List from "App/List";
import moment from "moment";
import { SavedNote } from "App/type";
import { ListContainer, Title } from "./Common";
import { useNavigate } from "react-router-dom";

const Reminders = ({ reminderNotes }: { reminderNotes: SavedNote[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Title>Reminders</Title>
      <ListContainer>
        <List>
          {reminderNotes.map((note, i) => (
            <List.Item
              key={i}
              className="text-sm"
              onClick={() => navigate(`/write/note/${note.id}`)}
            >
              <div className="flex">
                <span className="opacity-50 mt-1 min-w-5 w-5">
                  <BiFile />
                </span>
                <div>
                  {textToTitle(note.text, 20)}
                  <div className="flex items-center space-x-1 opacity-50">
                    <span>
                      <BiAlarmExclamation />
                    </span>
                    <span>
                      {moment(new Date(note.reminder!.date)).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      </ListContainer>
    </div>
  );
};

export default Reminders;
