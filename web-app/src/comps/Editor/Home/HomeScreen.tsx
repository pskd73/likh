import {
  ComponentProps,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { EditorContext, NoteSummary } from "../Context";
import QuickStart from "./QuickStart";
import Browse from "./Browse";
import Notes from "./Notes";
import Search from "./Search";
import Reminders from "./Reminders";
import { SavedNote } from "../type";
import Settings from "./Settings";
import Promotion from "./Promotion";
import Calendar from "./HomeCalendar";
import classNames from "classnames";
import Logo from "../../Logo";
import Todos from "./Todos";

const Col = ({ children, className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div className={classNames(className, "md:w-80 space-y-4")} {...restProps}>
      {children}
    </div>
  );
};

const Section = ({ children }: PropsWithChildren) => {
  return (
    <div className="md:flex flex-wrap md:space-x-8 my-10 space-y-4 md:space-y-0">
      {children}
    </div>
  );
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
          <Col>
            <Search
              searchTerm={searchTerm}
              onChange={(term) => setSearchTerm(term)}
            />
          </Col>
        </div>
      </div>
      <Section>
        <Col>
          {!searchTerm && !seeAll && <QuickStart />}
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
        <Col className="flex-1">
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
