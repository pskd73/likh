import { BaseEditor, BaseRange, Path, Point, Range, Transforms } from "slate";
import { CustomGrammar } from "../grammer";

type CustomRange = Range & {
  payload: Record<string, any>;
} & Record<string, any>;

function getTokenLength(token: string | Prism.Token) {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return (token.content as any).reduce(
      (l: any, t: any) => l + getTokenLength(t),
      0
    );
  }
}

function getTokenRanges(
  editor: BaseEditor,
  path: Path,
  token: string | Prism.Token,
  start: number,
  parentTokens: Array<Prism.Token>,
  parentPayload: Record<string, any>,
  grammer: CustomGrammar
): CustomRange[] {
  if (typeof token === "string") {
    const range: CustomRange = {
      anchor: { path, offset: start },
      focus: { path, offset: start + getTokenLength(token) },
      payload: parentPayload,
    };
    for (const pt of parentTokens) {
      range[pt.type as string] = true;
    }
    return [range];
  }

  if (Array.isArray(token.content)) {
    return getTokensRanges(
      editor,
      path,
      token.content,
      start,
      [...parentTokens, token],
      parentPayload,
      grammer
    );
  }

  const range: CustomRange = {
    [token.type]: true,
    anchor: { path, offset: start },
    focus: { path, offset: start + getTokenLength(token) },
    payload: parentPayload,
  };

  for (const pt of parentTokens) {
    range[pt.type] = true;
  }

  return [range];
}

const hidable: string[] = [
  "italic",
  "bold",
  "boldItalic",
  "title1",
  "title2",
  "title3",
  "notelink",
  "inlineCode",
  "mdLink",
  "image",
  "checkbox",
  "datetime",
  "blockedKatex",
  "inlineKatex",
  "strikethrough",
  "hr",
  "list",
  "bulletUnordered",
  "bulletOrdered",
  "bullet",
];

export function getTokensRanges(
  editor: BaseEditor,
  path: Path,
  tokens: Array<string | Prism.Token>,
  start: number,
  parentTokens: Prism.Token[],
  parentPayload: Record<string, any>,
  grammer: CustomGrammar
) {
  let ranges: CustomRange[] = [];
  for (const _token of tokens) {
    const _parentPayload: Record<string, any> = { ...parentPayload };
    const _parentTokens = [...parentTokens];
    if (typeof _token !== "string") {
      if (grammer[_token.type]?.payload) {
        for (const key of Object.keys(grammer[_token.type].payload)) {
          _parentPayload[key] = grammer[_token.type].payload[key](_token);
        }
      }

      const focused = isPointFocused(editor, {
        anchor: { path, offset: start },
        focus: { path, offset: start + _token.length },
      });
      if (focused) {
        _parentTokens.push({ type: "focused" } as any);
        _parentTokens.push({ type: `${_token.type}Focused` } as any);
      }

      if (hidable.includes(_token.type)) {
        _parentTokens.push({ type: "hidable" } as any);
      }
      _parentTokens.push(_token);
    }
    const newRanges = getTokenRanges(
      editor,
      path,
      _token,
      start,
      _parentTokens,
      _parentPayload,
      grammer
    );
    ranges = [...ranges, ...newRanges];
    start = getRangesEnd(newRanges, start);
  }
  return ranges;
}

function getRangesEnd(ranges: Range[], start: number) {
  if (ranges.length > 0) {
    return ranges[ranges.length - 1].focus.offset;
  }
  return start;
}

export function isPointFocused(editor: BaseEditor, range: BaseRange) {
  if (!editor.selection) return false;

  return Range.intersection(editor.selection, range);
}
