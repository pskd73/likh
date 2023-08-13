import { useContext } from "react";
import Editor, { Suggestion } from "./Core/Slate/Editor";
import { EditorContext } from "./Context";
import { BaseRange, Descendant } from "slate";
import { CustomEditor } from "./Core/Core";
import { blobToB64 } from "src/util";
import { getImage } from "./db";
import { Themes } from "./Theme";
import grammer from "./grammer";
import { textToTitle } from "src/Note";
import Event from "src/components/Event";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "./type";

const NoteEditor = ({
  note,
  onChange,
  scrollContainerId,
  blockPlaceholder,
}: {
  note: SavedNote;
  onChange: (change: {
    value: Descendant[];
    text: string;
    serialized: string;
    editor: CustomEditor;
  }) => void;
  scrollContainerId?: string;
  blockPlaceholder?: string;
}) => {
  const navigate = useNavigate();
  const {
    storage,
    plugins,
    themeName,
    editorFocus,
    getHashtags,
    setOrNewNote,
    allNotes,
  } = useContext(EditorContext);

  const getSuggestions = async (
    prefix: string,
    term: string,
    range: BaseRange
  ) => {
    const suggestions: Suggestion[] = [];

    plugins.forEach((plugin) => {
      if (plugin.suggestions && plugin.suggestions[prefix]) {
        const config = plugin.suggestions[prefix];
        for (const sugg of config.suggest(prefix, term, note!, range)) {
          suggestions.push(sugg);
        }
      }
    });

    if (prefix === "[[") {
      const links: Record<string, Suggestion> = {};
      for (const _note of Object.values(allNotes)) {
        for (const match of Array.from(
          _note.text.matchAll(/\[\[([^\[]+)\]\]/g)
        )) {
          if (
            !links[match[1]] &&
            match[1].toLowerCase().includes(term.toLowerCase())
          ) {
            links[match[1]] = {
              title: match[1],
              id: _note.id,
              replace: `[[${match[1]}]] `,
            };
          }
        }

        if (_note.id === note?.id) continue;
        const title = textToTitle(_note.text, 50);
        if (title.toLowerCase().includes(term.toLowerCase())) {
          const cleanedTitle = title.trim();
          links[cleanedTitle] = {
            title: cleanedTitle,
            id: _note.id,
            replace: `[[${cleanedTitle}]] `,
          };
        }
      }
      Object.values(links).forEach((link) => suggestions.push(link));
    } else if (prefix === "#") {
      Object.keys(getHashtags([note!.id])).forEach((hashtag) => {
        const tag = hashtag.replace("#", "");
        if (term === tag) return;
        if (tag.toLowerCase().includes(term.toLocaleLowerCase())) {
          suggestions.push({
            title: `${hashtag}`,
            replace: `${hashtag} `,
          });
        }
      });
    }
    return suggestions;
  };

  const handleNoteLinkClick = async (title: string, id?: string) => {
    Event.track("linked_note");
    if (id) {
      const note = await storage.getNote(id);
      if (note) {
        navigate(`/write/note/${note.id}`);
        return;
      }
    }
    const note = await setOrNewNote(title);
    navigate(`/write/note/${note.id}`);
  };

  return (
    <div className={`note-${note.id} note-editor`}>
      <Editor
        containerClassName={`note-${note.id}`}
        onChange={onChange}
        initValue={note.serialized}
        initText={note.text}
        onNoteLinkClick={handleNoteLinkClick}
        getSuggestions={getSuggestions}
        focus={(note?.created_at || 0) + (editorFocus || 0)}
        contextMenuPrefixes={[
          "[[",
          "#",
          ...plugins
            .filter((p) => p.suggestions)
            .map((p) => Object.keys(p.suggestions!))
            .reduce((prev, cur) => [...prev, ...cur], []),
        ]}
        getSavedImg={async (attachmentId, imgType) => {
          if (note && imgType === "attachment") {
            const blob = await storage.pouch.attachment(note.id, attachmentId);
            const uri = await blobToB64(blob);
            if (uri) {
              return { id: attachmentId, uri: uri as string };
            }
          }
          const img = await getImage(Number(attachmentId));
          return { id: attachmentId, uri: img.uri };
        }}
        handleSaveImg={async (img) => {
          if (note) {
            const match = img.uri.match(/^data:(.+);base64,(.+)$/);
            if (match) {
              const id = new Date().getTime().toString();
              await storage.pouch.attach(note.id, {
                id,
                data: match[2],
                type: match[1],
              });
              return { id, uri: img.uri };
            }
          }
        }}
        theme={Themes[themeName] || Themes.Basic}
        grammer={{
          ...plugins
            .filter((p) => p.grammer)
            .map((p) => p.grammer!)
            .reduce((prev, cur) => ({ ...cur(), ...prev }), {}),
          ...grammer,
        }}
        leafMakers={plugins.filter((p) => p.leafMaker).map((p) => p.leafMaker!)}
        elementMakers={plugins
          .filter((p) => p.elementMaker)
          .map((p) => p.elementMaker!)}
        blockPlaceholder={blockPlaceholder || `Type "/" for options`}
        contextMenuBoundaries={plugins
          .filter((p) => p.boundaries)
          .map((p) => p.boundaries!)
          .reduce((prev, cur) => [...prev, ...cur], [])}
        scrollContainerId={scrollContainerId}
      />
    </div>
  );
};

export default NoteEditor;
