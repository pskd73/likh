import { useEffect } from "react";
import { CustomEditor } from "./Core/Core";
import { Transforms } from "slate";

export type PastedImg = {
  uri: string;
};

export type SavedImg = {
  id: number;
  uri: string;
};

export const useEditorPaste = ({
  editor,
  handleSaveImg,
}: {
  editor: CustomEditor;
  handleSaveImg?: (img: PastedImg) => Promise<SavedImg>;
}) => {
  useEffect(() => {
    document.onpaste = async (event) => {
      if (event.clipboardData) {
        const items = event.clipboardData.items;
        for (const i in items) {
          const item = items[i];
          if (item.kind === "file" && item.type.startsWith("image")) {
            event.preventDefault();
            event.stopPropagation();
            var blob = item.getAsFile();
            if (blob) {
              var reader = new FileReader();
              reader.onload = async function (event) {
                if (handleSaveImg && event.target?.result) {
                  const savedImg = await handleSaveImg({
                    uri: event.target.result.toString(),
                  });
                  Transforms.insertText(editor, `![](image://${savedImg.id})`);
                }
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };
    return () => {
      document.onpaste = null;
    };
  }, [editor]);
};
