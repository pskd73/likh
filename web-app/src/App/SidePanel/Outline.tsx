import { useContext, useState } from "react";
import { EditorContext } from "src/App/Context";
import { isMobile } from "src/App/device";
import { scrollTo } from "src/App/scroll";
import { WithTitle } from "src/App/SidePanel/Common";
import useDelayedEffect from "src/App/useDelayedEffect";
import List from "../List";
import { FolderItem } from "../Folders";

type OutlineTitle = {
  text: string | null;
  level: number;
  id: string;
  slug: string;
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
    });
  });
  return titles;
};

const TitleList = ({ titles }: { titles: OutlineTitle[] }) => {
  const { setSideBar } = useContext(EditorContext);

  const handleClick = (title: OutlineTitle) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    scrollTo({ title: title.slug });
  };

  return (
    <List>
      {titles.map((title, i) => (
        <FolderItem
          key={i}
          level={title.level - 1}
          label={title.text || ""}
          onClickKind={() => handleClick(title)}
        />
      ))}
    </List>
  );
};

const Outline = () => {
  const { note } = useContext(EditorContext);
  const [titles, setTitles] = useState<OutlineTitle[]>([]);

  useDelayedEffect(() => {
    const titles = generateTitles();
    setTitles(titles);
  }, [note]);

  if (titles.length === 0) return null;

  return (
    <WithTitle title="Outline" active={false}>
      {titles && <TitleList titles={titles} />}
    </WithTitle>
  );
};

export default Outline;
