import classNames from "classnames";
import Prism from "prismjs";
import {
  KeyboardEventHandler,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createEditor,
  NodeEntry,
  Text,
  Descendant,
  BaseRange,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import grammer, {
  CustomGrammarValue,
  imageRegex,
  quoteRegex,
} from "src/App/grammer";
import slugify from "slugify";
import {
  CustomEditor,
  CustomElement,
  serialize,
  deserialize,
} from "src/App/Core/Core";
import {
  handleEnterForList,
  intend,
  parseListText,
  toggleCheckbox,
} from "src/App/Core/List";
import {
  codify,
  getCodeRanges,
  getRootCodeNode,
  handleBackspaceForCode,
  handleEnterForCode,
  handleTabForCode,
} from "src/App/Core/Code";
import { getTokensRanges } from "src/App/Core/Range";
import {
  ContextMenu,
  ContextMenuList,
  useContextMenu,
} from "src/App/Core/ContextMenu";
import { PastedImg, SavedImg, useEditorPaste } from "src/App/useEditorPaste";
import { Theme, Themes } from "src/App/Theme";
import Leaf from "src/App/Core/Slate/Leaf";
import SlateElement from "src/App/Core/Slate/SlateElement";
import { escape } from "src/util";

const defaultValue = [
  {
    type: "paragraph",
    children: [{ text: "New note" }],
  },
];

export type Suggestion = {
  title: string;
  replace: string;
  id?: string;
  description?: string;
};

const Editor = ({
  onChange,
  initValue,
  initText,
  editor: passedEditor,
  onNoteLinkClick,
  getSuggestions,
  highlight,
  handleSaveImg,
  getSavedImg,
  containerClassName,
  theme,
  contextMenuPrefixes,
  grammer: passedGrammer,
  leafElements,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
    editor: CustomEditor;
  }) => void;
  containerClassName: string;
  initValue?: string;
  initText?: string;
  editor?: CustomEditor;
  onNoteLinkClick?: (title: string, id?: string) => void;
  getSuggestions?: (prefix: string, term: string) => Promise<Suggestion[]>;
  highlight?: string;
  handleSaveImg?: (img: PastedImg) => Promise<SavedImg | undefined>;
  getSavedImg?: (id: string, imgType: string) => Promise<SavedImg>;
  theme?: Theme;
  contextMenuPrefixes?: string[];
  grammer?: Record<string, CustomGrammarValue>;
  leafElements?: Array<
    (props: {
      attributes: any;
      children: any;
      leaf: Record<string, any>;
      text: { text: string };
    }) => ReactElement | undefined
  >;
}) => {
  theme = theme || Themes.Basic;

  const editor = useMemo(
    () => passedEditor || withHistory(withReact(createEditor())),
    [passedEditor]
  );
  const contextMenu = useContextMenu(
    editor,
    contextMenuPrefixes || [],
    ({ index, target, prefix }) => {
      handleContextMenuSelect(index, target, prefix);
    }
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    (async () => {
      if (contextMenu.activePrefix && getSuggestions) {
        let _suggestions: Suggestion[] = await getSuggestions(
          contextMenu.activePrefix,
          contextMenu.search
        );
        contextMenu.setCount(_suggestions.length);
        return setSuggestions(_suggestions);
      }
      contextMenu.setCount(0);
      return setSuggestions([]);
    })();
  }, [contextMenu.search, contextMenu.activePrefix]);

  useEditorPaste({
    editor,
    handleSaveImg,
    container: document.querySelector(`.${containerClassName}`),
  });

  const renderLeaf = useCallback((props: any) => {
    for (const leafElement of leafElements || []) {
      const element = leafElement(props);
      if (element) {
        return element;
      }
    }
    return (
      <Leaf
        {...props}
        onCheckboxToggle={(path) => toggleCheckbox(editor, path)}
        onNoteLinkClick={onNoteLinkClick || (() => {})}
        theme={theme}
      />
    );
  }, []);

  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      if (!Text.isText(node)) {
        return [];
      }
      const newGrammer = Object.assign({}, { ...grammer, ...passedGrammer });
      if (highlight) {
        for (const key of Object.keys(newGrammer)) {
          if (["hashtag"].includes(key)) continue;
          (newGrammer[key] as any) = {
            ...(newGrammer[key] as any),
            inside: {
              ...(newGrammer[key] as any).inside,
              highlight: {
                pattern: RegExp(escape(highlight), "i"),
              },
            },
          };
        }
        newGrammer.highlight = {
          pattern: RegExp(escape(highlight), "i"),
          inside: {},
        };
      }
      const tokens = Prism.tokenize(node.text, newGrammer);

      let ranges: BaseRange[] = [];
      const [rootCodeNode] = getRootCodeNode(editor, path);
      if (!rootCodeNode) {
        ranges = [
          ...ranges,
          ...getTokensRanges(editor, path, tokens, 0, [], {}, newGrammer),
        ];
      } else {
        ranges = [...ranges, ...getCodeRanges(editor, path)];
      }
      return ranges.map((range) => ({ ...range, path }));
    },
    [highlight]
  );

  const renderElement = useCallback(
    ({
      attributes,
      children,
      element,
    }: {
      attributes: any;
      children: any;
      element: CustomElement;
    }) => {
      let text = "";
      for (const child of element.children) {
        text += child.text;
      }

      // image
      const imgMatch = text.match(imageRegex);
      const imgUrl = imgMatch ? imgMatch[1] : null;
      const localImgMatch = imgUrl?.match(/^((image)|(attachment)):\/\/(.+)$/);
      let imgUri: string | undefined = undefined;
      if (getSavedImg && localImgMatch) {
        const imgId = Number(localImgMatch[4]);
        const imgType = localImgMatch[1];
        getSavedImg(imgId.toString(), imgType)
          .then((savedImg) => {
            const el = document.querySelector<HTMLImageElement>(
              `img[src="${imgType}://${imgId}"]`
            );
            if (el) {
              el.src = savedImg.uri;
            }
          })
          .catch((e) => {});
      }

      // quote
      const quote = text.match(quoteRegex);

      // title
      const titleMatch = text.match(/^(#{1,6}) .+/);
      const titleSlug = titleMatch ? slugify(text, { lower: true }) : undefined;
      const titleLavel = titleMatch ? titleMatch[1].length : undefined;

      // list
      const listLevel = parseListText(text)?.level;

      return (
        <SlateElement
          attributes={attributes}
          children={children}
          element={element}
          img={{ url: imgUrl || undefined, uri: imgUri }}
          title={{ slug: titleSlug, level: titleLavel }}
          list={{ level: listLevel }}
          quote={!!quote}
        />
      );
    },
    []
  );

  const handleContextMenuSelect = (
    index: number,
    target: BaseRange,
    prefix: string
  ) => {
    Transforms.select(editor, target);
    const suggestion = suggestions[index];
    Transforms.insertText(editor, suggestion.replace);
  };

  const handleChange = (value: Descendant[]) => {
    onChange({
      value,
      text: serialize(value),
      serialized: JSON.stringify(value),
      editor,
    });
    contextMenu.handleChange();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    contextMenu.handleKeyDown(e);
    if (e.key === "Enter") {
      handleEnterForCode(editor, e);
      handleEnterForList(editor, e);
    } else if (e.key === "Tab") {
      e.preventDefault();
      intend(editor, !e.shiftKey);
      handleTabForCode(editor, e);
    } else if (e.key === "Backspace") {
      handleBackspaceForCode(editor, e);
    }
  };

  const handlePaste = () => {
    setTimeout(() => codify(editor), 200);
  };

  const getInitValue = () => {
    if (initValue) {
      return JSON.parse(initValue);
    }
    if (initText) {
      return deserialize(initText);
    }
    return defaultValue;
  };

  return (
    <div id="editorContainer">
      <Slate
        editor={editor}
        value={getInitValue() as any}
        onChange={handleChange}
      >
        <Editable
          className={theme.font.base}
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          placeholder="Write your mind here ..."
          onPaste={handlePaste}
        />
        <ContextMenu
          ref={contextMenu.ref}
          style={{ top: -9999, right: -9999 }}
          className={classNames("text-sm", { hidden: !suggestions.length })}
        >
          <ContextMenuList>
            {suggestions.map((suggestion, i) => (
              <ContextMenuList.Item
                key={i}
                idx={i}
                hover={contextMenu.index === i}
                onClick={(e) => contextMenu.handleItemClick(e, i)}
              >
                {suggestion.title}
              </ContextMenuList.Item>
            ))}
          </ContextMenuList>
        </ContextMenu>
      </Slate>
    </div>
  );
};

export default Editor;
