export const link = {
  pattern:
    /((https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/m,
};

export const notelink = {
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

export const strikethrough = {
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
  },
};

export const italic = {
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
    notelink
  },
};

export const bold = {
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
    notelink
  },
};

export const title1 = {
  pattern: /^# .+$/m,
  inside: {
    punctuation: /^# /m,
    italic,
    bold,
    link,
  },
};

export const title2 = {
  pattern: /^## .+$/m,
  inside: {
    punctuation: /^## /m,
    italic,
    bold,
    link,
  },
};

export const title3 = {
  pattern: /^### .+$/m,
  inside: {
    punctuation: /^### /m,
    italic,
    bold,
    link,
  },
};

export const inlineCode = {
  pattern: /`+[^`]*`+/,
  greedy: true,
  inside: {
    punctuation: [{ pattern: /^`+/ }, { pattern: /`+$/ }],
  },
};


export const checkbox = {
  pattern: /^\[[ x]\]/,
  inside: {
    punctuation: /\[|\]/
  }
}

export const listRegex = /^( *)(([-*\+])|(([0-9]+).)) (.*)$/m;
export const list = {
  pattern: listRegex,
  inside: {
    bullet: /^ *(([-*\+])|([0-9]+.)) /,
    italic,
    bold,
    strikethrough,
    link,
    notelink,
    checkbox,
    inlineCode
  },
  greedy: true,
};

export const quoteRegex = /^\> .*$/m;
export const quote = {
  pattern: /^\> .*$/m,
  inside: {
    punctuation: /^> /m,
    italic,
    bold,
    strikethrough,
    link,
    notelink,
  },
};

export const hashtag = {
  pattern: /\B(#[a-zA-Z_]+\b)(?!;)/m,
  greedy: true,
};

export const imageRegex = /^\!\[.*\]\(.+( ".+")?\)$/m;
export const image = {
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

export const codeBlock = {
  pattern: /^``` ?[a-zA-Z0-9]*$/m,
  inside: {
    punctuation: /```/,
    language: /[a-zA-Z0-9]+/,
  },
};
