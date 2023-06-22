import {
  ChangeEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EditorContext } from "../../Context";
import classNames from "classnames";
import Collapsible from "../../Collapsible";
import ListWidget from "../../List";
import Button from "../../../Button";
import { TbExternalLink } from "react-icons/tb";
import { isMobile } from "../../device";
import { BiAlarm, BiLink } from "react-icons/bi";
import { scrollTo } from "../../scroll";
import { getGoogleCalendarLink } from "../../Reminder";
import { textToTitle } from "../../../../Note";
import moment from "moment";
import Remind from "./Remind";

type OutlineTitle = {
  text: string | null;
  level: number;
  id: string;
  children: OutlineTitle[];
  slug: string;
};

type NoteLink = {
  text: string;
  id: string;
};

const nested = (
  titles: OutlineTitle[],
  startIdx: number
): { children: OutlineTitle[]; nextIdx: number } => {
  const result: OutlineTitle[] = [];
  let i = startIdx;
  while (i < titles.length) {
    const prev = result[result.length - 1];
    if (prev) {
      if (prev.level < titles[i].level) {
        const { children, nextIdx } = nested(titles, i);
        prev.children = children;
        i = nextIdx;
        continue;
      } else if (prev.level > titles[i].level) {
        return { children: result, nextIdx: i };
      }
    }
    result.push(titles[i]);
    i += 1;
  }
  return { children: result, nextIdx: i };
};

const generateTitles = () => {
  const nodes = document.querySelectorAll("[data-title-level]");
  const titles: OutlineTitle[] = [];
  nodes.forEach((node) => {
    titles.push({
      text: node.textContent?.replace(/^#{1,6} /, "") || "",
      level: Number(node.getAttribute("data-title-level")),
      slug: node.getAttribute("data-title-slug")!.toString(),
      id: node.id,
      children: [],
    });
  });
  return titles;
};

const generateLinks = () => {
  const nodes = document.querySelectorAll(".notelink");
  const links: NoteLink[] = [];
  nodes.forEach((node) => {
    links.push({ text: node.textContent!, id: node.id });
  });
  return links;
};

const List = ({
  titles,
  root,
  prefix = "",
}: {
  titles: OutlineTitle[];
  root?: boolean;
  prefix?: string;
}) => {
  const { setSideBar } = useContext(EditorContext);

  return (
    <ul className={classNames("space-y-1", { "pl-4": !root })}>
      {titles.map((title, i) => (
        <li key={i}>
          <span
            className={classNames("hover:underline cursor-pointer text-sm")}
            onClick={() => {
              if (isMobile) {
                setSideBar(undefined);
              }
              scrollTo({ title: title.slug });
            }}
          >
            {prefix}
            {i + 1}. {title.text}
          </span>
          {title.children && (
            <div className="my-2">
              <List titles={title.children} prefix={`${prefix}${i + 1}.`} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const Outline = () => {
  const { note, setOrNewNote, setSideBar } =
    useContext(EditorContext);
  const [timer, setTimer] = useState(new Date().getTime());
  const [linksActive, setLinksActive] = useState(false);
  const titles = useMemo(() => {
    const titles = generateTitles();
    return nested(titles, 0).children;
  }, [timer]);
  const links = useMemo(() => {
    return generateLinks();
  }, [timer]);

  useEffect(() => {
    setTimer(new Date().getTime());
  }, [note]);

  return (
    <div>
      <div className="p-2">
        {titles && <List titles={titles} root />}
        {titles.length === 0 ? <span>No headings yet!</span> : null}
      </div>
      <Collapsible>
        {links.length > 0 && (
          <Collapsible.Item
            active={linksActive}
            handleToggle={() => setLinksActive((a) => !a)}
          >
            <Collapsible.Item.Label>
              <div className="flex items-center space-x-1">
                <BiLink />
                <span>Links</span>
              </div>
            </Collapsible.Item.Label>
            <Collapsible.Item.Content>
              <ListWidget>
                {links.map((link, i) => (
                  <ListWidget.Item
                    key={i}
                    className="cursor-auto hover:bg-white flex items-center text-sm space-x-2"
                  >
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => {
                        if (isMobile) {
                          setSideBar(undefined);
                        }
                        (window.location as any).href = `#${link.id}`;
                      }}
                    >
                      {link.text}
                    </span>
                    <div>
                      <Button lite onClick={() => setOrNewNote(link.text)}>
                        <TbExternalLink />
                      </Button>
                    </div>
                  </ListWidget.Item>
                ))}
              </ListWidget>
            </Collapsible.Item.Content>
          </Collapsible.Item>
        )}
      </Collapsible>
      <Remind />
    </div>
  );
};

export default Outline;
