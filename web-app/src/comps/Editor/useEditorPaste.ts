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
            const blob = item.getAsFile();
            if (blob) {
              handleFile(blob);
            }
          }
        }
      }
    };
    return () => {
      document.onpaste = null;
    };
  }, [editor]);

  useEffect(() => {
    const dropZone = document.getElementById("editable");
    dropZone?.addEventListener("drop", handleDrop);
    return () => {
      dropZone?.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer?.files;

    if (files) {
      for (const i in files) {
        const file = files[i];
        if (file.type?.startsWith("image")) {
          handleFile(file);
        }
      }
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      if (handleSaveImg && event.target?.result) {
        const uri = event.target.result.toString();
        let imgText = `![](${uri})`;
        const savedImg = await handleSaveImg({
          uri,
        });
        imgText = `![Image](image://${savedImg.id})`;
        Transforms.insertText(editor, imgText);
      }
    };
    reader.readAsDataURL(file);
  };
};
