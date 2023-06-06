import { GrammarValue } from "prismjs";

export type CustomGrammerValue = GrammarValue & { payload?: any };
export type CustomGrammer = Record<string, CustomGrammerValue>;

export const link = {
  pattern:
    /((https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/m,
};

export const notelink: GrammarValue = {
  pattern: /\[\[[^\[\]]+\]\]/m,
  greedy: true,
  inside: {
    punctuation: [
      {
        pattern: /^\[\[/,
        greedy: true,
      },
      {
        pattern: /\]\]$/,
        greedy: true,
      },
    ],
  },
};

export const mdLink: CustomGrammerValue = {
  pattern: /\[.+\]\(.+\)/m,
  greedy: true,
  inside: {
    labelPart: {
      pattern: /^\[.+\]/m,
      inside: {
        punctuation: [
          {
            pattern: /^\[/,
            greedy: true,
          },
          {
            pattern: /\]$/,
            greedy: true,
          },
        ],
      },
    },
    punctuation: {
      pattern: /\(.+\)$/m,
    },
  },
  payload: {
    link: (token: any) => token.content[1].content.match(/^\((.*)\)$/)[1],
  },
};

export const strikethrough: CustomGrammerValue = {
  pattern: /~~.+~~/m,
  greedy: true,
  inside: {
    punctuation: [
      {
        pattern: /^~~/m,
        greedy: true,
      },
      {
        pattern: /~~$/m,
        greedy: true,
      },
    ],
    mdLink,
  },
};

export const italic: CustomGrammerValue = {
  pattern: /[_*][^_*]+[_*]/m,
  greedy: true,
  inside: {
    punctuation: [
      {
        pattern: /^[_*]/m,
        greedy: true,
      },
      {
        pattern: /[_*]$/m,
        greedy: true,
      },
    ],
    link,
    notelink,
    mdLink,
  },
};

export const bold: CustomGrammerValue = {
  pattern: /[_*]{2}[^_*]+[_*]{2}/m,
  greedy: true,
  inside: {
    punctuation: [
      {
        pattern: /^[_*]{2}/m,
        greedy: true,
      },
      {
        pattern: /[_*]{2}$/m,
        greedy: true,
      },
    ],
    italic,
    link,
    notelink,
    mdLink,
  },
};

export const title1: CustomGrammerValue = {
  pattern: /^# .+$/m,
  inside: {
    hashes: /^# /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const title2: CustomGrammerValue = {
  pattern: /^## .+$/m,
  inside: {
    hashes: /^## /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const title3: CustomGrammerValue = {
  pattern: /^### .+$/m,
  inside: {
    hashes: /^### /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const inlineCode: CustomGrammerValue = {
  pattern: /`+[^`]+`+/,
  greedy: true,
  inside: {
    punctuation: [{ pattern: /^`+/ }, { pattern: /`+$/ }],
  },
};

export const checkbox: CustomGrammerValue = {
  pattern: /^\[[ x]\]/,
  inside: {
    punctuation: /\[|\]/,
  },
};

export const listRegex = /^( *)(([-*\+])|(([0-9]+).)) (.*)$/m;
export const list: CustomGrammerValue = {
  pattern: listRegex,
  inside: {
    bullet: /^ *(([-*\+])|([0-9]+.)) /,
    italic,
    bold,
    strikethrough,
    link,
    notelink,
    checkbox,
    inlineCode,
    mdLink,
  },
  greedy: true,
};

export const quoteRegex = /^\> .*$/m;
export const quote: CustomGrammerValue = {
  pattern: /^\> .*$/m,
  inside: {
    punctuation: /^> /m,
    italic,
    bold,
    strikethrough,
    link,
    notelink,
    mdLink,
  },
};

export const hashtag: CustomGrammerValue = {
  pattern: /\B(#[a-zA-Z_]+\b)(?!;)/m,
  greedy: true,
};

export const imageRegex = /^\!\[.*\]\(.+( ".+")?\)$/m;
export const image: CustomGrammerValue = {
  pattern: imageRegex,
  greedy: true,
  inside: {
    link,
    alt: {
      pattern: /^\[.*\]/m,
      greedy: true,
    },
  },
};

export const codeBlock: CustomGrammerValue = {
  pattern: /^``` ?[a-zA-Z0-9]*$/m,
  inside: {
    punctuation: /```/,
    language: /[a-zA-Z0-9]+/,
  },
};

const grammer: CustomGrammer = {
  strikethrough,
  italic,
  bold,
  title1,
  title2,
  title3,
  list,
  link,
  quote,
  hashtag,
  image,
  notelink,
  inlineCode,
  mdLink,
};

export default grammer;
