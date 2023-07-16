import LaTeXPlugin from "./LaTeX";
import SlashPlugin from "./Slash";
import { TimestampPlugin } from "./Timestamp";
import { RNPluginCreator } from "./type";

export const enabledPlugins: RNPluginCreator[] = [
  TimestampPlugin,
  SlashPlugin,
  LaTeXPlugin,
];
