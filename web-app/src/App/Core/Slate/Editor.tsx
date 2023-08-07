import classNames from "classnames";
import Prism from "prismjs";
import {
  KeyboardEventHandler,
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
import {
  CustomGrammarValue,
  imageRegex,
  quoteRegex,
} from "src/App/grammer";
import {
  CustomEditor,
  CustomElement,
  serialize,
  deserialize,
  focusEnd,
} from "src/App/Core/Core";
import { handleEnterForList, intend } from "src/App/Core/List";
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
  Boundary,
  ContextMenu,
  ContextMenuList,
  useContextMenu,
} from "src/App/Core/ContextMenu";
import { PastedImg, SavedImg, useEditorPaste } from "src/App/useEditorPaste";
import { Theme, Themes } from "src/App/Theme";
import Leaf, { LeafMaker } from "src/App/Core/Slate/Leaf";
import SlateElement, { ElementMaker } from "src/App/Core/Slate/SlateElement";
import { escape } from "src/util";

const defaultValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export type SuggestionAction = {
  replace?: string;
  anchorOffset?: number;
  focusOffset?: number;
};

export type Suggestion = {
  title: string;
  id?: string;
  description?: string;
  onClick?: (editor: CustomEditor) => Promise<SuggestionAction>;
} & SuggestionAction;

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
  contextMenuBoundaries,
  grammer: passedGrammer,
  leafMakers,
  elementMakers,
  focus,
  blockPlaceholder,
  scrollContainerId,
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
  getSuggestions?: (
    prefix: string,
    term: string,
    range: BaseRange
  ) => Promise<Suggestion[]>;
  highlight?: string;
  handleSaveImg?: (img: PastedImg) => Promise<SavedImg | undefined>;
  getSavedImg?: (id: string, imgType: string) => Promise<SavedImg>;
  theme?: Theme;
  contextMenuPrefixes?: string[];
  contextMenuBoundaries?: Boundary[];
  grammer: Record<string, CustomGrammarValue>;
  leafMakers?: LeafMaker[];
  elementMakers?: ElementMaker[];
  focus?: number;
  blockPlaceholder?: string;
  scrollContainerId?: string;
}) => {
  theme = theme || Themes.Basic;

  const editor = useMemo(
    () => passedEditor || withHistory(withReact(createEditor())),
    [passedEditor]
  );
  const contextMenu = useContextMenu(
    editor,
    contextMenuPrefixes || [],
    contextMenuBoundaries || [],
    ({ index, target, prefix }) => {
      handleContextMenuSelect(index, target, prefix);
    }
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    (async () => {
      if (contextMenu.activePrefix && contextMenu.target && getSuggestions) {
        let _suggestions: Suggestion[] = await getSuggestions(
          contextMenu.activePrefix,
          contextMenu.search,
          contextMenu.target
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

  useEffect(() => {
    if (focus && scrollContainerId) {
      focusEnd(editor, scrollContainerId);
    }
  }, [focus]);

  const renderLeaf = useCallback(
    (props: any) => (
      <Leaf
        {...props}
        onNoteLinkClick={onNoteLinkClick || (() => {})}
        theme={theme}
        leafMakers={leafMakers}
        placeholder={blockPlaceholder}
        setSelection={(range) => Transforms.setSelection(editor, range)}
        editor={editor}
      />
    ),
    []
  );

  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      if (!Text.isText(node)) {
        return [];
      }
      let ranges: BaseRange[] = [];

      // Placeholder
      if (
        node.text === "" &&
        JSON.stringify(editor.selection?.anchor.path) === JSON.stringify(path)
      ) {
        ranges.push({
          anchor: { path, offset: 0 },
          focus: { path, offset: 0 },
          newLine: true,
        } as BaseRange);
      }

      const tokens = Prism.tokenize(node.text, passedGrammer);
      const [rootCodeNode] = getRootCodeNode(editor, path);
      if (!rootCodeNode) {
        ranges = [
          ...ranges,
          ...getTokensRanges(editor, path, tokens, 0, [], {}, passedGrammer),
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

      return (
        <SlateElement
          attributes={attributes}
          children={children}
          element={element}
          img={{ url: imgUrl || undefined, uri: imgUri }}
          quote={!!quote}
          elementMakers={elementMakers || []}
          text={text}
          editor={editor}
        />
      );
    },
    []
  );

  const handleContextMenuSelect = async (
    index: number,
    target: BaseRange,
    prefix: string
  ) => {
    Transforms.select(editor, target);
    const suggestion = suggestions[index];

    if (suggestion.onClick) {
      const action = await suggestion.onClick(editor);
      suggestion.replace = action.replace;
      suggestion.anchorOffset = action.anchorOffset;
      suggestion.focusOffset = action.focusOffset;
    }

    suggestion.replace !== undefined &&
      Transforms.insertText(editor, suggestion.replace);

    if (editor.selection) {
      if (suggestion.anchorOffset !== undefined) {
        const { anchor } = editor.selection;
        editor.setSelection({
          anchor: {
            path: anchor.path,
            offset: anchor.offset - suggestion.anchorOffset,
          },
        });
      }
      if (suggestion.focusOffset !== undefined) {
        const { focus } = editor.selection;
        editor.setSelection({
          focus: {
            path: focus.path,
            offset: focus.offset - suggestion.focusOffset,
          },
        });
      }
    }
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
    if (e.isPropagationStopped()) return;
    if (e.key === "Enter") {
      handleEnterForCode(editor, e);
      handleEnterForList(editor, e);
    } else if (e.key === "Tab") {
      let handled: boolean | undefined = false;
      handled = handled || handleTabForCode(editor, e);
      handled = handled || intend(editor, !e.shiftKey);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
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
                {suggestion.description && (
                  <ContextMenuList.Item.Description>
                    {suggestion.description}
                  </ContextMenuList.Item.Description>
                )}
              </ContextMenuList.Item>
            ))}
          </ContextMenuList>
        </ContextMenu>
      </Slate>
    </div>
  );
};

export default Editor;
