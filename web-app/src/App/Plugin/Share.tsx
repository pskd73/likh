import { useContext, useEffect, useState } from "react";
import { RNPluginCreator } from "./type";
import { EditorContext } from "../Context";
import { textToTitle } from "src/Note";
import { BiCopy, BiFile, BiShare } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import Button from "src/comps/Button";
import { SavedNote } from "../type";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDownloadableNote } from "../File";

const HOST = "http://127.0.0.1:5000";

const shareNote = async (
  text: string
): Promise<{ _id: string; created_at: number }> => {
  const res = await fetch(`${HOST}/share/note`, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

const getShared = async (
  shareId: string
): Promise<{ _id: string; created_at: number; text: string }> => {
  const res = await fetch(`${HOST}/share/note?share_id=${shareId}`);
  return await res.json();
};

const NotePage = () => {
  const [search] = useSearchParams();
  const { usePluginState, allNotes, storage } = useContext(EditorContext);
  const [state, setState] = usePluginState<{ shares?: Record<string, string> }>(
    "test2"
  );
  const [shared, setShared] = useState<{
    _id: string;
    created_at: number;
    text: string;
  }>();
  const [copyBtnTxt, setCopyBtnTxt] = useState("Copy link");
  const noteId = search.get("noteId");
  const note = noteId ? allNotes[noteId] : undefined;
  const shareId = noteId ? (state?.shares || {})[noteId] : undefined;

  useEffect(() => {
    (async () => {
      if (shareId) {
        setShared(await getShared(shareId));
      }
    })();
  }, [shareId]);

  const share = async () => {
    if (note) {
      const downloadableNote = await getDownloadableNote(note, storage.pouch);
      const json = await shareNote(downloadableNote.text);
      setState({
        ...state,
        shares: { ...(state.shares || {}), [note.id]: json._id },
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://app.retronote.app/write/plugin/share?shareId=${shareId}`
    );
    setCopyBtnTxt("Copied!");
    setTimeout(() => {
      setCopyBtnTxt("Copy link");
    }, 3000);
  };

  return (
    <div>
      {note && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>
                <BiFile />
              </span>
              <span className="font-bold">{textToTitle(note.text, 50)}</span>
            </div>
            <div className="space-x-2">
              <div className="space-x-2 inline-block">
                <Button onClick={share} className="flex items-center space-x-2">
                  <BiShare />
                  <span>Share now</span>
                </Button>
              </div>
            </div>
          </div>

          {shared && (
            <div className="flex items-center space-x-2">
              <span>
                Shared {moment(new Date(shared.created_at)).fromNow()}
              </span>
              <Button
                className="text-xs flex items-center space-x-2"
                onClick={handleCopy}
              >
                <BiCopy />
                <span>{copyBtnTxt}</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SharePage = () => {
  const [search] = useSearchParams();
  const shareId = search.get("shareId");
  const [shared, setShared] = useState<{ text: string }>();

  useEffect(() => {
    (async () => {
      if (shareId) {
        setShared(await getShared(shareId));
      }
    })();
  }, [shareId]);

  return (
    <div className="mb-20">
      {shared && (
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {shared.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [search] = useSearchParams();

  if (search.get("noteId")) {
    return <NotePage />;
  }
  if (search.get("shareId")) {
    return <SharePage />;
  }

  return null;
};

const SharePlugin: RNPluginCreator = () => {
  return {
    name: "Share",
    version: 1,
    page: {
      url: "share",
      element: <Page />,
    },
    noteStatuBarIcons: {
      share: (note) => ({
        icon: <BiShare />,
        tooltop: "Share",
        onClick: (e, navigate) =>
          navigate(`/write/plugin/share?noteId=${note.id}`),
      }),
    },
  };
};

export default SharePlugin;
