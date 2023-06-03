import { useContext, useMemo } from "react";
import { EditorContext } from "../Context";
import classNames from "classnames";
import Collapsible from "../Collapsible";
import ListWidget from "../List";
import Button from "../../Button";
import { TbExternalLink } from "react-icons/tb";

type OutlineTitle = {
  text: string | null;
  level: number;
  id: string;
  children: OutlineTitle[];
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
  const nodes = document.querySelectorAll(".acc-title");
  const titles: OutlineTitle[] = [];
  nodes.forEach((node) => {
    let level = NaN;
    const rawLevel = node.getAttribute("data-title-level");
    if (rawLevel) {
      level = Number(rawLevel.replace("title", ""));
    }
    titles.push({
      text: node.textContent,
      level,
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
  return (
    <ul className={classNames("space-y-2", { "pl-4": !root })}>
      {titles.map((title, i) => (
        <li key={i}>
          <a
            href={`#${title.id}`}
            className={classNames("hover:underline", {
              "text-lg": title.level === 1,
              "text-md": title.level === 2,
            })}
          >
            {prefix}
            {i + 1}. {title.text}
          </a>
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
  const { note } = useContext(EditorContext);
  const titles = useMemo(() => {
    const titles = generateTitles();
    return nested(titles, 0).children;
  }, [note]);
  const links = useMemo(() => {
    return generateLinks();
  }, [note]);

  console.log({ links });

  return (
    <div>
      <div className="p-4">
        {titles && <List titles={titles} root />}
        {titles.length === 0 ? <span>No headings yet!</span> : null}
      </div>
      <Collapsible>
        <Collapsible.Item title="Links" onToggle={console.log} active>
          <ListWidget>
            {links.map((link, i) => (
              <ListWidget.Item
                key={i}
                className="cursor-auto hover:bg-white flex justify-between items-center"
              >
                <a href={`#${link.id}`} className="hover:underline">
                  {link.text}
                </a>
                <div>
                  <Button>
                    <TbExternalLink />
                  </Button>
                </div>
              </ListWidget.Item>
            ))}
          </ListWidget>
        </Collapsible.Item>
      </Collapsible>
    </div>
  );
};

export default Outline;
