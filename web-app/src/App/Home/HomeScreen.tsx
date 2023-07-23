import {
  ComponentProps,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { EditorContext } from "src/App/Context";
import QuickStart from "src/App/Home/QuickStart";
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
  const { allNotes, getTodoNotes } = useContext(EditorContext);
  const [todos, notes] = useMemo(() => {
    let _todos = getTodoNotes();
    _todos = _todos.filter((summary) => summary.total - summary.checked > 0);
    return [
      _todos.sort((a, b) => b.note.created_at - a.note.created_at),
      Object.values(allNotes),
    ];
  }, [allNotes]);

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
          {todos.length > 0 && <Todos todos={todos} />}
        </Col>
        <Col>{notes.length > 3 && <Calendar />}</Col>
      </Section>
      <hr />
      <Section>
        <Promotion />
      </Section>
    </div>
  );
};

export default HomeScreen;
