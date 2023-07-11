import {
  ComponentProps,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { EditorContext, NoteSummary } from "src/App/Context";
import QuickStart from "src/App/Home/QuickStart";
import Browse from "src/App/Home/Browse";
import Notes from "src/App/Home/Notes";
import Reminders from "src/App/Home/Reminders";
import { SavedNote } from "src/App/type";
import Settings from "src/App/Home/Settings";
import Promotion from "src/App/Home/Promotion";
import Calendar from "src/App/Home/HomeCalendar";
import classNames from "classnames";
import Logo from "src/comps/Logo";
import Todos from "src/App/Home/Todos";

const Col = ({ children, className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      className={classNames(className, "w-full md:w-72 space-y-4")}
      {...restProps}
    >
      {children}
    </div>
  );
};

const Section = ({ children }: PropsWithChildren) => {
  return <div className="my-10 flex gap-8 flex-wrap">{children}</div>;
};

const HomeScreen = () => {
  const {
    notesToShow,
    note,
    getHashtags,
    setSearchTerm,
    searchTerm,
    getTodoNotes,
  } = useContext(EditorContext);
  const [seeAll, setSeeAll] = useState(false);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);
  const reminderNotes = useMemo<SavedNote[]>(() => {
    return notesToShow
      .filter((n) => !!n.note.reminder)
      .map((summary) => summary.note);
  }, [notesToShow]);
  const todos = useMemo(() => {
    let _todos = getTodoNotes();
    _todos = _todos.filter(
      (summary) => summary.todo!.total - summary.todo!.checked > 0
    );
    return _todos.sort((a, b) => b.note.created_at - a.note.created_at);
  }, [notesToShow]);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col">
        <div className="space-y-4 w-full">
          <div className="text-5xl w-full flex items-center space-x-4 font-CrimsonText">
            <div className="fill-primary w-12 max-h-full">
              <Logo />
            </div>
            <span>
              Hello <span className="italic">there!</span>
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <Section>
        <Col>
          <QuickStart />
          {notesToShow.length > 0 && (
            <Notes seeAll={seeAll} toggleSeeAll={() => setSeeAll((s) => !s)} />
          )}
          {todos.length > 0 && <Todos summaries={todos} />}
        </Col>
        <Col>
          {Object.keys(hashtags).length > 0 && <Browse />}
          {reminderNotes.length > 0 && (
            <Reminders reminderNotes={reminderNotes} />
          )}
        </Col>
        <Col>
          <Calendar />
        </Col>
      </Section>
      <hr />
      <Section>
        <Col>
          <Settings />
        </Col>
      </Section>
      <hr />
      <Section>
        <Promotion />
      </Section>
    </div>
  );
};

export default HomeScreen;
