type PartContent = string | JSX.Element;
type PartLoc = { i: number; len: number };

type Part = {
  type: "text" | "element";
  content: PartContent;
};

type Extractor = {
  getPartLocs: (text: string) => PartLoc[];
  getPart: (text: string) => Part;
};

export const makeExtractor = (
  regexGetter: () => RegExp,
  partGetter: (text: string) => Part
): Extractor => {
  return {
    getPart: partGetter,
    getPartLocs: (text) => {
      const regex = regexGetter();
      if (!text) {
        return [];
      }
      const matches = text.match(regex);
      if (!matches) {
        return [];
      }
      let prevEndI = 0;
      const locs = [];
      for (const match of matches) {
        const i = text.indexOf(match, prevEndI);
        const len = match.length;
        locs.push({ i, len });
        prevEndI = i + len;
      }
      return locs;
    },
  };
};

export const highlight = (
  text: string,
  extractors: Extractor[]
): PartContent[] => {
  let parts: Part[] = [{ type: "text", content: text }];
  let tmp: Part[] = [];
  for (const extractor of extractors) {
    parts.reverse();
    let part = parts.pop();
    while (part) {
      if (part.type !== "text") {
        tmp.push(part);
      } else {
        const locs = extractor.getPartLocs(part.content as string);
        if (locs.length === 0) {
          tmp.push(part);
        }
        let prevEndI = 0;
        for (let i = 0; i < locs.length; i++) {
          const loc = locs[i];
          const nextLoc = locs[i + 1];

          const partText = part.content as string;
          const left = partText.substring(prevEndI, loc.i);
          const center = partText.substring(loc.i, loc.i + loc.len);
          const right = partText.substring(loc.i + loc.len, nextLoc?.i);
          const extractedPart = extractor.getPart(center);
          left && tmp.push({ type: "text", content: left });
          tmp.push(extractedPart);
          right && tmp.push({ type: "text", content: right });
          prevEndI = nextLoc?.i;
        }
      }
      part = parts.pop();
    }
    parts = [...tmp];
    tmp = [];
  }
  return parts.map((p) => p.content);
};
