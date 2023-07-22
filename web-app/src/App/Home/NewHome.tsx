import moment from "moment";
import {
  ComponentProps,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getShortcutText } from "../useShortcuts";
import {
  TfiCheck,
  TfiPencilAlt,
  TfiImport,
  TfiCalendar,
  TfiArrowRight,
} from "react-icons/tfi";
import classNames from "classnames";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { useNavigate } from "react-router-dom";
import List from "../List";
import { WithTitle } from "../SidePanel/Common";
import { EditorContext, NoteSummary } from "../Context";
import { textToTitle } from "src/Note";
import { getTimeline } from "../Timeline";
import Event from "src/components/Event";
import { openFile } from "../File";
import EditableNote from "../EditableNote";
import HeadlessNoteEditor from "../HeadlessNoteEditor";

const DateTime = () => {
  const [time, setTime] = useState(new Date());
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    const now = new Date();
    timeout.current = setTimeout(() => {
      handleEveryMinute();
      timer.current = setInterval(handleEveryMinute);
    }, (60 - now.getSeconds()) * 1000);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const handleEveryMinute = () => {
    setTime(new Date());
  };

  const _moment = moment(time);
  const first = _moment.format("ddd, DD MMM hh:mm");
  const second = _moment.format("A");

  return (
    <div className="font-SourceSans3 text-4xl">
      {first} <span className="text-xl">{second}</span>
    </div>
  );
};

const ClickableTile = ({
  label,
  description,
  icon,
  rightIcon,
  className,
  ...restProps
}: ComponentProps<"div"> & {
  label: string;
  description: string;
  icon?: ReactElement;
  rightIcon?: ReactElement;
}) => {
  return (
    <div
      className={classNames(
        "flex justify-between items-center",
        "border border-primary border-opacity-10 rounded-lg",
        "py-4 bg-primary bg-opacity-5 active:bg-opacity-10",
        "cursor-pointer active:shadow transition-all",
        "px-6",
        "hover:border-opacity-100",
        className
      )}
      {...restProps}
    >
      <div className="flex items-center">
        {icon && <div className="text-4xl mr-6">{icon}</div>}
        <div className="flex flex-col pr-4">
          <div className="text-xl font-medium">{label}</div>
          <div className="text-sm text-primary text-opacity-50">
            {description}
          </div>
        </div>
      </div>
      {rightIcon && <div className="text-2xl">{rightIcon}</div>}
    </div>
  );
};

const NewHome = () => {
  const { notesToShow, getTodoNotes, newNote } = useContext(EditorContext);
  const navigate = useNavigate();
  const { todos, reminders } = useMemo(() => {
    let _todos = getTodoNotes();
    _todos = _todos.filter(
      (summary) => summary.todo!.total - summary.todo!.checked > 0
    );
    const todos = _todos.sort((a, b) => b.note.created_at - a.note.created_at);
    const reminders = getTimeline(notesToShow).filter((item) => item.future);
    return { todos, reminders };
  }, [notesToShow]);
  const lastEditedNote = useMemo(() => {
    return notesToShow.reduce((a: NoteSummary | undefined, b) => {
      return (a?.note.updated_at || 0) > (b.note.updated_at || 0) ? a : b;
    }, undefined);
  }, [notesToShow]);

  const handleNewNote = () => {
    Event.track("new_note");
    const note = newNote({
      text: `# A title for the note\nWrite your mind here ...\n`,
    });
    navigate(`/write/note/${note!.id}`);
  };

  const handleNewTodo = () => {
    Event.track("new_todo");
    const note = newNote({
      text: `# ✅ Things to do\n- [ ] Task one\n- [ ] Task two\n`,
    });
    navigate(`/write/note/${note!.id}`);
  };

  const handleOpen = async () => {
    const text = (await openFile()) as string;
    const note = newNote({ text });
    navigate(`/write/note/${note!.id}`);
  };

  return (
    <div>
      <div className="flex justify-end mb-10">
        <DateTime />
      </div>
      <div className="lg:flex lg:space-x-6 space-y-6 lg:space-y-0 mb-6">
        <div className="flex-1">
          {lastEditedNote && (
            <div className="mb-4">
              <ClickableTile
                label={textToTitle(lastEditedNote.note.text)}
                description={moment(
                  new Date(lastEditedNote.note.updated_at || 0)
                ).fromNow()}
                onClick={() =>
                  navigate(`/write/note/${lastEditedNote.note.id}`)
                }
                rightIcon={<TfiArrowRight />}
              />
            </div>
          )}
          <div className="lg:grid lg:grid-cols-2 gap-4 space-y-4 lg:space-y-0">
            <div>
              <ClickableTile
                label="Write new"
                description={getShortcutText("N")}
                icon={<TfiPencilAlt />}
                onClick={handleNewNote}
              />
            </div>
            <div>
              <ClickableTile
                label="Journal"
                description={getShortcutText("J")}
                icon={<TfiCalendar />}
              />
            </div>
            <div>
              <ClickableTile
                label="Todo"
                description={getShortcutText("T")}
                icon={<TfiCheck />}
                onClick={handleNewTodo}
              />
            </div>
            <div>
              <ClickableTile
                label="Import"
                description={getShortcutText("O")}
                icon={<TfiImport />}
                onClick={handleOpen}
              />
            </div>
          </div>
        </div>
        <div
          className={classNames(
            "lg:w-1/3 p-4 border border-primary",
            "border-opacity-20 rounded-md",
            "max-h-[300px] overflow-y-scroll scrollbar-hide"
          )}
        >
          <HeadlessNoteEditor noteId={"1690050008847"} />
        </div>
      </div>
      <hr className="mb-6" />
      <div className="lg:flex space-x-6 mb-6">
        <div className="flex-1">
          <div className="lg:grid lg:grid-cols-2 gap-4 space-y-4 lg:space-y-0">
            <WithTitle title="Todos" noPadding>
              <List>
                {todos.map((summary, i) => (
                  <List.Item
                    key={i}
                    className="text-base text-primary"
                    onClick={() => navigate(`/write/note/${summary.note.id}`)}
                  >
                    {textToTitle(summary.note.text)}
                    <List.Item.Description>
                      [{summary.todo?.checked}/{summary.todo?.total}]
                    </List.Item.Description>
                  </List.Item>
                ))}
              </List>
            </WithTitle>
            <WithTitle title="Reminders" noPadding>
              <List>
                {reminders.map((item, i) => (
                  <List.Item
                    key={i}
                    className="text-base text-primary group"
                    onClick={() =>
                      navigate(`/write/note/${item.summary.note.id}`)
                    }
                  >
                    {textToTitle(item.summary.note.text)}
                    <List.Item.Description>
                      <span className="group-hover:hidden">
                        {moment(item.date).fromNow()}
                      </span>
                      <span className="hidden group-hover:inline-block">
                        {moment(item.date).format("DD/MM/YYYY hh:mm:ss")}
                      </span>
                    </List.Item.Description>
                  </List.Item>
                ))}
              </List>
            </WithTitle>
          </div>
        </div>
        <div className="w-1/3" />
      </div>
    </div>
  );
};

export default NewHome;
