import { TbExternalLink } from "react-icons/tb";
import List from "../List";
import Button from "../../Button";
import { useContext, useMemo } from "react";
import { EditorContext } from "../Context";
import { isMobile } from "../device";
import { WithTitle } from "./Common";
import { BiLink } from "react-icons/bi";

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
  const { note, setSideBar, setOrNewNote } = useContext(EditorContext);
  const links = useMemo(() => {
    return generateLinks();
  }, [note]);

  if (links.length === 0) return null;

  return (
    <WithTitle title="Linked notes">
      <List>
        {links.map((link, i) => (
          <List.Item
            key={i}
            className="flex items-center text-sm space-x-2"
            onClick={() => {
              if (isMobile) {
                setSideBar(undefined);
              }
              (window.location as any).href = `#${link.id}`;
            }}
          >
            <span>
              <BiLink />
            </span>
            <span>{link.text}</span>
          </List.Item>
        ))}
      </List>
    </WithTitle>
  );
};

export default Links;
