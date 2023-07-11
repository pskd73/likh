import { isLinked, textToTitle } from "src/Note";
import { SavedNote } from "./type";

export type LinkSuggestion = {
  text: string;
  occurances: number;
};

export function getLinkSuggestions(notes: SavedNote[]) {
  const links: Record<string, boolean> = {};
  const titles: string[] = [];
  for (const note of notes) {
    titles.push(textToTitle(note.text));
    const matches = note.text.match(/\[\[([^\[]+)\]\](\([^\(]+\))?/g);
    if (matches) {
      for (const match of matches) {
        const wordMatch = match.match(/^\[\[(.*)\]\]$/);
        if (wordMatch) {
          links[wordMatch[1].toLowerCase()] = true;
        }
      }
    }
  }

  for (const link of Object.keys(links)) {
    for (const title of titles) {
      if (isLinked(link, title)) {
        delete links[link];
        break;
      }
    }
  }

  const suggestions: Record<string, LinkSuggestion> = {};
  for (const note of notes) {
    for (const link of Object.keys(links)) {
      if (note.text.toLowerCase().includes(link.toLowerCase())) {
        if (!suggestions[link]) {
          suggestions[link] = {
            text: link,
            occurances: 0,
          };
        }
        suggestions[link].occurances += 1;
      }
    }
  }

  return Object.values(suggestions);
}
