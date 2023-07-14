import { Fragment, useContext, useState } from "react";
import { EditorContext } from "src/App/Context";
import classNames from "classnames";
import { isMobile } from "src/App/device";
import { scrollTo } from "src/App/scroll";
import { WithTitle } from "src/App/SidePanel/Common";
import useDelayedEffect from "src/App/useDelayedEffect";
import List from "../List";

type OutlineTitle = {
  text: string | null;
  level: number;
  id: string;
  children: OutlineTitle[];
  slug: string;
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

const TitleList = ({
  titles,
  root,
  prefix = "",
}: {
  titles: OutlineTitle[];
  root?: boolean;
  prefix?: string;
}) => {
  const { setSideBar } = useContext(EditorContext);

  const handleClick = (title: OutlineTitle) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    scrollTo({ title: title.slug });
  };

  return (
    <List className={classNames({ })}>
      {titles.map((title, i) => (
        <Fragment key={i}>
          <List.Item onClickKind={() => handleClick(title)}>
            {/* {prefix}
            {i + 1}. {title.text} */}
            {title.text}
          </List.Item>
          {title.children && (
            <div className="ml-3 pl-1 border-l border-primary border-opacity-30">
              <TitleList
                titles={title.children}
                prefix={`${prefix}${i + 1}.`}
              />
            </div>
          )}
        </Fragment>
      ))}
    </List>
  );
};

const Outline = () => {
  const { note } = useContext(EditorContext);
  const [titles, setTitles] = useState<OutlineTitle[]>([]);

  useDelayedEffect(() => {
    const titles = generateTitles();
    setTitles(nested(titles, 0).children);
  }, [note]);

  if (titles.length === 0) return null;

  return (
    <WithTitle title="Outline" active>
      {titles && <TitleList titles={titles} root />}
    </WithTitle>
  );
};

export default Outline;
