// define word character as all EN letters, numbers, and dash
// copied from - https://github.com/ianstormtaylor/slate/issues/4162#issuecomment-1169258940
import { Editor, Range } from "slate";
import { BasePoint } from "slate";
import { ReactEditor } from "slate-react";

// change this regexp if you want other characters to be considered a part of a word
const wordRegexp = /[0-9a-zA-Z-\/#_@\[]/;

const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

const getLeftChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection as Range);
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset - 1,
    },
    focus: {
      path: end.path,
      offset: point.offset,
    },
  });
};

const getRightChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection as Range);
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset,
    },
    focus: {
      path: end.path,
      offset: point.offset + 1,
    },
  });
};

export const getCurrentWord = (editor: ReactEditor) => {
  const { selection } = editor; // selection is Range type

  if (selection) {
    const end = Range.end(selection); // end is a Point
    let currentWord = "";
    const currentPosition = cloneDeep(end);
    let startOffset = end.offset;
    let endOffset = end.offset;

    // go left from cursor until it finds the non-word character
    while (
      currentPosition.offset >= 0 &&
      getLeftChar(editor, currentPosition).match(wordRegexp)
    ) {
      currentWord = getLeftChar(editor, currentPosition) + currentWord;
      startOffset = currentPosition.offset - 1;
      currentPosition.offset--;
    }

    // go right from cursor until it finds the non-word character
    currentPosition.offset = end.offset;
    while (
      currentWord.length &&
      getRightChar(editor, currentPosition).match(wordRegexp)
    ) {
      currentWord += getRightChar(editor, currentPosition);
      endOffset = currentPosition.offset + 1;
      currentPosition.offset++;
    }

    const currentRange: Range = {
      anchor: {
        path: end.path,
        offset: startOffset,
      },
      focus: {
        path: end.path,
        offset: endOffset,
      },
    };

    return {
      currentWord,
      currentRange,
    };
  }

  return {};
};
