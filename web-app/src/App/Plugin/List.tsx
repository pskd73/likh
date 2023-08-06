import { ReactElement } from "react-markdown/lib/react-markdown";
import EmojisPlugin from "./Emojis";
import HeadingsPlugin from "./Headings";
import KaTeXPlugin from "./KaTeX";
import { LinkGraphPlugin } from "./LinkGraph";
import { SharePlugin } from "./Share";
import SlashPlugin from "./Slash";
import { TimestampPlugin } from "./Timestamp";
import { RNPluginCreator } from "./type";
import BulletsPlugin from "./Bullets/Plugin";

export const enabledPlugins: RNPluginCreator[] = [
  TimestampPlugin,
  SlashPlugin,
  KaTeXPlugin,
  BulletsPlugin,
  EmojisPlugin,
  HeadingsPlugin,
];

export const plugins: ReactElement[] = [<LinkGraphPlugin />, <SharePlugin />];
