import List from "src/App/List";
import { useContext, useState } from "react";
import { EditorContext } from "src/App/Context";
import { isMobile } from "src/App/device";
import { WithTitle } from "src/App/SidePanel/Common";
import { BiNetworkChart } from "react-icons/bi";
import useDelayedEffect from "src/App/useDelayedEffect";
import { FolderItem } from "../Folders";

type NoteLink = {
  text: string;
  id: string;
};

const generateLinks = () => {
  const nodes = document.querySelectorAll(".tab.active .notelink");
  const links: NoteLink[] = [];
  nodes.forEach((node) => {
    links.push({ text: node.textContent!, id: node.id });
  });
  return links;
};

const Links = () => {
  const { note, setSideBar } = useContext(EditorContext);
  const [links, setLinks] = useState<NoteLink[]>([]);

  useDelayedEffect(() => {
    setLinks(generateLinks());
  }, [note]);

  if (links.length === 0) return null;

  return (
    <WithTitle title="Linked notes" active={false}>
      <List>
        {links.map((link, i) => (
          <FolderItem
            key={i}
            level={0}
            label={link.text}
            icon={<BiNetworkChart />}
            onClickKind={() => {
              if (isMobile) {
                setSideBar(undefined);
              }
              (window.location as any).href = `#${link.id}`;
            }}
          />
        ))}
      </List>
    </WithTitle>
  );
};

export default Links;
