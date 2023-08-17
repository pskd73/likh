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
import SpellCheckPlugin from "./SpellCheck";
import GoogleFontsPlugin from "./GoogleFonts";
import TablesPlugin from "./Tables";
import EpubPlugin from "./Epub";

export const enabledPlugins: RNPluginCreator[] = [
  TimestampPlugin,
  SlashPlugin,
  KaTeXPlugin,
  BulletsPlugin,
  EmojisPlugin,
  HeadingsPlugin,
  TablesPlugin,
];

export const plugins: ReactElement[] = [
  <LinkGraphPlugin />,
  <SharePlugin />,
  <SpellCheckPlugin />,
  <GoogleFontsPlugin />,
  <EpubPlugin />,
];
