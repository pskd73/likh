import { GrammarValue } from "prismjs";

export type CustomGrammarValue = GrammarValue & { payload?: any, priority?: number };
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
  pattern: /\[[^\[\]\(\)]+\]\([^\(\)\[\]]+\)/m,
  greedy: true,
  inside: {
    labelPart: {
      pattern: /^\[[^\[\]\(\)]+\]/m,
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
    link: (token: any) => token?.content[1]?.content?.match(/^\((.*)\)$/)[1],
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
  inside: {
    punctuation: [/^[_*]/m, /[_*]$/m],
    link,
    notelink,
    mdLink,
  },
};

export const bold: CustomGrammarValue = {
  pattern: /[_*]{2}[^_*]+[_*]{2}/m,
  inside: {
    punctuation: [
      {
        pattern: /^[_*]{2}/m,
      },
      {
        pattern: /[_*]{2}$/m,
      },
    ],
    link,
    notelink,
    mdLink,
  },
};

export const boldItalic: CustomGrammarValue = {
  pattern: /[_*]{3}[^_*]+[_*]{3}/m,
  inside: {
    punctuation: [
      {
        pattern: /^[_*]{3}/m,
      },
      {
        pattern: /[_*]{3}$/m,
      },
    ],
    link,
    notelink,
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

export const hashtag1: CustomGrammarValue = {
  pattern: /( )(#[a-zA-Z0-9_\/]+)(?!\/)/m,
  lookbehind: true,
  greedy: true,
};

export const hashtag2: CustomGrammarValue = {
  pattern: /^(#[a-zA-Z0-9_\/]+)(?!\/)/m,
  greedy: true,
};

export const quoteRegex = /^\> .*$/m;
export const quote: CustomGrammarValue = {
  pattern: /^\> .*$/m,
  inside: {
    punctuation: /^> /m,
    boldItalic,
    bold,
    italic,
    strikethrough,
    link,
    notelink,
    mdLink,
  },
};

export const imageRegex = /^\!\[.*\]\(([^\)\[\"\']+)( ".*")?\)$/m;
export const image: CustomGrammarValue = {
  pattern: imageRegex,
  greedy: true,
  inside: {
    link,
    alt: {
      pattern: /^\!\[(.*)\]/m,
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

export const hr: CustomGrammarValue = {
  pattern: /^---$/m,
};

const grammer: CustomGrammar = {
  link,
  quote,
  hashtag: [hashtag1, hashtag2],
  image,
  notelink,
  inlineCode,
  mdLink,
  boldItalic,
  bold,
  italic,
  strikethrough,
  hr,
};

export default grammer;
