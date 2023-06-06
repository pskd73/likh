import { BaseEditor, Path, Range } from "slate";
import { CustomGrammer } from "../grammer";

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
  grammer: CustomGrammer
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
  "title1",
  "title2",
  "title3",
  "notelink",
  "inlineCode",
  "mdLink",
];

export function getTokensRanges(
  editor: BaseEditor,
  path: Path,
  tokens: Array<string | Prism.Token>,
  start: number,
  parentTokens: Prism.Token[],
  parentPayload: Record<string, any>,
  grammer: CustomGrammer
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

      if (hidable.includes(_token.type)) {
        _parentTokens.push({ type: "hidable" } as any);
        const focused = isPointFocused(editor, {
          path,
          start,
          end: start + _token.length,
        });
        if (focused) {
          _parentTokens.push({ type: "focused" } as any);
        }
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

function isPointFocused(
  editor: BaseEditor,
  point: { path: number[]; start: number; end: number }
) {
  if (!editor.selection) return false;
  const startPath =
    JSON.stringify(editor.selection.anchor.path) === JSON.stringify(point.path);
  const endPath =
    JSON.stringify(editor.selection?.focus.path) === JSON.stringify(point.path);

  if (startPath) {
    if (
      point.start <= editor.selection.anchor.offset &&
      point.end >= editor.selection.anchor.offset
    ) {
      return true;
    }
  }

  if (endPath) {
    if (
      point.start <= editor.selection.focus.offset &&
      point.end >= editor.selection.focus.offset
    ) {
      return true;
    }
  }

  if (startPath && endPath) {
    if (
      point.start >= editor.selection.anchor.offset &&
      point.end <= editor.selection.focus.offset
    ) {
      return true;
    }
    if (
      point.start >= editor.selection.focus.offset &&
      point.end <= editor.selection.anchor.offset
    ) {
      return true;
    }
  }

  return false;
}
