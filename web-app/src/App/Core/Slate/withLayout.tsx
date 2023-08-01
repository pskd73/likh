import {
  BaseEditor,
  Editor,
  Transforms,
  Node,
  Element as SlateElement,
} from "slate";
import { CustomElement } from "../Core";
import { ReactEditor } from "slate-react";

const withLayout = (editor: ReactEditor & BaseEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length <= 1 && Editor.string(editor, [0, 0]) === "") {
        const title = {
          type: "title",
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, title as CustomElement, {
          at: path.concat(0),
          select: true,
        });
      }

      if (editor.children.length < 2) {
        const paragraph = {
          type: "paragraph",
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph as CustomElement, {
          at: path.concat(1),
        });
      }

      for (const [child, childPath] of Array.from(
        Node.children(editor, path)
      )) {
        let type: string;
        const slateIndex = childPath[0];
        const enforceType = (type: any) => {
          if (SlateElement.isElement(child) && child.type !== type) {
            const newProperties: Partial<SlateElement> = { type };
            Transforms.setNodes<SlateElement>(editor, newProperties, {
              at: childPath,
            });
          }
        };

        if (slateIndex === 0) {
          type = "title";
          enforceType(type);
        } else if (slateIndex === 1) {
          type = "paragraph";
          enforceType(type);
        } else {
          break;
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export default withLayout;
