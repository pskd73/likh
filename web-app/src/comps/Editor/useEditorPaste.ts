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
  container,
  handleSaveImg,
}: {
  editor: CustomEditor;
  container: HTMLElement | null;
  handleSaveImg?: (img: PastedImg) => Promise<SavedImg>;
}) => {
  useEffect(() => {
    if (container) {
      (container as any).onpaste = async (event: ClipboardEvent) => {
        if (event.clipboardData) {
          const items = event.clipboardData.items;
          for (const i in items) {
            const item = items[i];
            if (item.kind === "file" && item.type.startsWith("image")) {
              event.preventDefault();
              event.stopPropagation();
              const blob = item.getAsFile();
              if (blob) {
                return handleFile(blob);
              }
            }
          }
        }
      };
      return () => {
        container.onpaste = null;
      };
    }
  }, [editor, container]);

  useEffect(() => {
    container?.addEventListener("drop", handleDrop);
    return () => {
      container?.removeEventListener("drop", handleDrop);
    };
  }, [editor, container]);

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
    const LIMIT_KB = 500;
    const reader = new FileReader();
    reader.onload = async function (event) {
      if (handleSaveImg && event.target?.result) {
        const uri = event.target.result.toString();
        if (uri.length > LIMIT_KB * 1000) {
          return alert(`Cannot upload more than ${LIMIT_KB}kb images!`);
        }
        // let imgText = `![](${uri})`;
        // const savedImg = await handleSaveImg({
        //   uri,
        // });
        const imgText = `![Image](${uri})`;
        Transforms.insertText(editor, imgText);
      }
    };
    reader.readAsDataURL(file);
  };
};
