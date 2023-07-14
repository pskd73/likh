import List from "src/App/List";
import { useContext, useState } from "react";
import { EditorContext } from "src/App/Context";
import { isMobile } from "src/App/device";
import { WithTitle } from "src/App/SidePanel/Common";
import { BiLink } from "react-icons/bi";
import useDelayedEffect from "src/App/useDelayedEffect";

type NoteLink = {
  text: string;
  id: string;
};

const generateLinks = () => {
  const nodes = document.querySelectorAll(".notelink");
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
    <WithTitle title="Linked notes">
      <List>
        {links.map((link, i) => (
          <List.Item
            key={i}
            withIcon
            onClickKind={() => {
              if (isMobile) {
                setSideBar(undefined);
              }
              (window.location as any).href = `#${link.id}`;
            }}
          >
            <List.Item.Icon>
              <BiLink />
            </List.Item.Icon>
            <span>{link.text}</span>
          </List.Item>
        ))}
      </List>
    </WithTitle>
  );
};

export default Links;
