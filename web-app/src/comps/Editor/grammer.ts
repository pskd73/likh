import { GrammarValue } from "prismjs";

export type CustomGrammarValue = GrammarValue & { payload?: any };
export type CustomGrammar = Record<string, CustomGrammarValue>;

export const link = {
  pattern:
    /((https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/m,
  inside: {},
};

export const notelink: CustomGrammarValue = {
  pattern: /\[\[[^\[\]]+\]\](\([^\(\)]+\))?/m,
  greedy: true,
  inside: {
    punctuation: [
      {
        pattern: /^\[\[/,
        greedy: true,
      },
      {
        pattern: /\]\]/,
        greedy: true,
      },
    ],
    notelinkId: {
      pattern: /\(.+\)$/,
      inside: {
        punctuation: [
          { pattern: /^\(/, greedy: true },
          { pattern: /\)$/, greedy: true },
        ],
      },
    },
  },
  payload: {
    notelinkId: (token: any) => {
      return token.content[3]?.content
        ? token.content[3]?.content[1]
        : undefined;
    },
  },
};

export const mdLink: CustomGrammarValue = {
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

export const strikethrough: CustomGrammarValue = {
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

export const italic: CustomGrammarValue = {
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

export const bold: CustomGrammarValue = {
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

export const title1: CustomGrammarValue = {
  pattern: /^# .+$/m,
  inside: {
    hashes: /^# /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const title2: CustomGrammarValue = {
  pattern: /^## .+$/m,
  inside: {
    hashes: /^## /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const title3: CustomGrammarValue = {
  pattern: /^### .+$/m,
  inside: {
    hashes: /^### /m,
    italic,
    bold,
    link,
    mdLink,
  },
};

export const inlineCode: CustomGrammarValue = {
  pattern: /`+[^`]+`+/,
  greedy: true,
  inside: {
    punctuation: [{ pattern: /^`+/ }, { pattern: /`+$/ }],
  },
};

export const checkbox: CustomGrammarValue = {
  pattern: /^\[[ x]\]/,
  inside: {
    punctuation: /\[|\]/,
  },
};

export const listRegex = /^( *)(([-*\+])|(([0-9]+).)) (.*)$/m;
export const list: CustomGrammarValue = {
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
export const quote: CustomGrammarValue = {
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

export const hashtag: CustomGrammarValue = {
  pattern: /\B(#[a-zA-Z_]+\b)(?!;)/m,
  greedy: true,
  inside: {},
};

export const imageRegex = /^\!\[.*\]\(([^\)\[\"\']+)( ".*")?\)$/m;
export const image: CustomGrammarValue = {
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

export const codeBlock: CustomGrammarValue = {
  pattern: /^``` ?[a-zA-Z0-9]*$/m,
  inside: {
    punctuation: /```/,
    language: /[a-zA-Z0-9]+/,
  },
};

const grammer: CustomGrammar = {
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
