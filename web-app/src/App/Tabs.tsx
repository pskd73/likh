import classNames from "classnames";
import {
  ComponentProps,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiX } from "react-icons/bi";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
  useOutlet,
} from "react-router-dom";
import Button from "src/comps/Button";
import NoteTab from "./NoteTab";
import { EditorContext } from "./Context";
import { useTitle } from "src/comps/useTitle";

type Tab = {
  key: string;
  elem: ReactElement | null;
  title?: string;
};

export const useTabs = () => {
  const [tabs, setTabs] = useState<Record<string, Tab>>({});

  const addTab = (key: string, elem: ReactElement | null) => {
    if (tabs[key]) {
      return;
    }
    setTabs({ ...tabs, [key]: { key, elem } });
  };

  const setTitle = (key: string, title: string) => {
    setTabs((tabs) => ({ ...tabs, [key]: { ...tabs[key], title } }));
  };

  const closeTab = (key: string) => {
    setTabs((tabs) => {
      delete tabs[key];
      return { ...tabs };
    });
  };

  return {
    tabs,
    setTabs,

    addTab,
    setTitle,
    closeTab,
  };
};

export const TabsContext = createContext({} as ReturnType<typeof useTabs>);

const Tab = ({
  children,
  active,
  onClose,
  style,
  ...restProps
}: ComponentProps<"li"> & { active?: boolean; onClose: () => void }) => {
  return (
    <li
      className={classNames(
        "max-w-[140px] h-full",
        "flex items-center px-2 justify-between",
        "border-r border-primary border-opacity-10",
        "cursor-pointer",
        {
          "bg-base bg-opacity-100": active,
          "bg-primary bg-opacity-0": !active,
          "hover:bg-opacity-10": !active,
          "rounded-t": active,
        }
      )}
      style={{ width: 100, ...style }}
      {...restProps}
    >
      <span
        className={classNames(
          "text-xs inline-block",
          "text-ellipsis whitespace-nowrap overflow-hidden"
        )}
        style={{ width: "calc(100% - 28px)" }}
      >
        {children}
      </span>
      <div>
        <Button
          lite
          className="w-6 h-6 p-0 flex justify-center items-center"
          onClick={(e) => {
            onClose();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <BiX />
        </Button>
      </div>
    </li>
  );
};

const Tabs = () => {
  const ref = useRef<HTMLUListElement>(null);
  const { tabs, closeTab } = useContext(TabsContext);
  const navigate = useNavigate();
  const width = useMemo(
    () => (ref.current ? ref.current.getBoundingClientRect().width : null),
    [ref.current]
  );

  if (!Object.keys(tabs).length) return null;

  return (
    <div
      className={classNames(
        "sticky top-0 left-[300px] h-8 w-full",
        "border-primary border-opacity-20",
        "bg-base z-10"
      )}
    >
      <ul
        ref={ref}
        className={classNames("h-full bg-primary bg-opacity-10", "flex")}
      >
        {Object.values(tabs).map((tab, i) => (
          <Tab
            key={tab.key}
            style={{
              width: width ? width / Object.keys(tabs).length : undefined,
            }}
            active={tab.key === window.location.pathname}
            onClick={() => navigate(tab.key)}
            onClose={() => {
              closeTab(tab.key);
              if (tab.key === window.location.pathname) {
                if (i > 0) {
                  navigate(Object.values(tabs)[i - 1].key, { replace: true });
                } else {
                  navigate("/write", { replace: true });
                }
              }
            }}
          >
            {tab.title}
          </Tab>
        ))}
      </ul>
    </div>
  );
};

export const TabsContainer = () => {
  const { tabs, addTab } = useContext(TabsContext);
  const { setNote } = useContext(EditorContext);
  const { pathname } = useLocation();
  const { setTitle } = useTitle();

  useEffect(() => {
    if (pathname.startsWith("/write/note")) {
      const noteId = pathname.split("/").pop()!;
      addTab(window.location.pathname, <NoteTab noteId={noteId} />);
      setNote({ id: noteId });
    }
  }, [pathname]);

  useEffect(() => {
    const active = tabs[pathname];
    if (active && active.title) {
      setTitle(active.title);
    }
  }, [pathname, tabs]);

  if (!pathname.startsWith("/write/note")) return <Outlet />;

  return (
    <>
      {Object.values(tabs).map((tab) => (
        <div
          key={tab.key}
          className={classNames({
            hidden: pathname !== tab.key,
          })}
        >
          {tab.elem}
        </div>
      ))}
    </>
  );
};

export default Tabs;
