import { TbExternalLink } from "react-icons/tb";
import List from "../List";
import Button from "../../Button";
import { useContext, useMemo } from "react";
import { EditorContext } from "../Context";
import { isMobile } from "../device";
import { WithTitle } from "./Common";

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
            noHover
            className="flex items-center text-sm space-x-2 p-0"
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
          </List.Item>
        ))}
      </List>
    </WithTitle>
  );
};

export default Links;
