import { ReactElement } from "react-markdown/lib/react-markdown";
import EmojisPlugin from "./Emojis";
import HeadingsPlugin from "./Headings";
import KaTeXPlugin from "./KaTeX";
import { LinkGraphPlugin } from "./LinkGraph";
import MarkdownListsPlugin from "./MarkdownLists";
import { SharePlugin } from "./Share";
import SlashPlugin from "./Slash";
import { TimestampPlugin } from "./Timestamp";
import { RNPluginCreator } from "./type";

export const enabledPlugins: RNPluginCreator[] = [
  TimestampPlugin,
  SlashPlugin,
  KaTeXPlugin,
  MarkdownListsPlugin,
  EmojisPlugin,
  HeadingsPlugin,
];

export const plugins: ReactElement[] = [<LinkGraphPlugin />, <SharePlugin />];
