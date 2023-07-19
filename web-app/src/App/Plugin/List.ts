import Hashtags from "./Hashtags";
import KaTeXPlugin from "./KaTeX";
import MarkdownListsPlugin from "./MarkdownLists";
import SlashPlugin from "./Slash";
import { TimestampPlugin } from "./Timestamp";
import { RNPluginCreator } from "./type";

export const enabledPlugins: RNPluginCreator[] = [
  TimestampPlugin,
  SlashPlugin,
  KaTeXPlugin,
  MarkdownListsPlugin,
  Hashtags,
];
