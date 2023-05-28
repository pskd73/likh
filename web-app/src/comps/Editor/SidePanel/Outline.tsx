import { useContext, useEffect, useMemo } from "react";
import { EditorContext } from "../Context";
import classNames from "classnames";

type OutlineTitle = {
  text: string | null;
  level: number;
  id: string;
  children: OutlineTitle[];
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

// console.log(
//   nested(
//     [
//       { text: "", level: 1, id: "1", children: [] },
//       { text: "", level: 1, id: "2", children: [] },
//       { text: "", level: 2, id: "3", children: [] },
//       { text: "", level: 3, id: "4", children: [] },
//       { text: "", level: 2, id: "5", children: [] },
//       { text: "", level: 1, id: "6", children: [] },
//       { text: "", level: 3, id: "7", children: [] },
//       { text: "", level: 2, id: "8", children: [] },
//     ],
//     0
//   ).children
// );

const generate = () => {
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
    const titles = generate();
    return nested(titles, 0).children;
  }, [note.text]);

  return (
    <div className="p-4">
      {titles && <List titles={titles} root />}
      {titles.length === 0 ? <span>No headings yet!</span> : null}
    </div>
  );
};

export default Outline;
