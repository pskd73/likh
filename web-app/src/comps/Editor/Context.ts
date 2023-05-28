import { createContext, useState } from "react";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type CountStatType = "words" | "readTime";

export type EditorContextType = {
  sideBar: boolean;
  toggleSideBar: () => void;

  activeSideMenus: string[];
  toggleSideMenu: (key: string) => void;
  isSideMenuActive: (key: string) => boolean;

  showStats: boolean;
  setShowStats: StateSetter<boolean>;

  typewriterMode: boolean;
  setTypewriterMode: StateSetter<boolean>;

  countStatType: CountStatType;
  setCountStatType: StateSetter<CountStatType>;
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

export const useEditor = () => {
  const [sideBar, setSideBar] = useState(false);
  const [activeSideMenus, setActiveSideMenus] = useState<string[]>(["notes", "settings"]);
  const [showStats, setShowStats] = useState(true);
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [countStatType, setCountStatType] = useState<CountStatType>("words");

  const toggleSideBar = () => setSideBar((b) => !b);

  const toggleSideMenu = (key: string) => {
    setActiveSideMenus((items) => {
      const _items = [...items];
      if (items.includes(key)) {
        items.splice(items.indexOf(key), 1);
      } else {
        items.push(key);
      }
      return _items;
    });
  };

  const isSideMenuActive = (key: string) => activeSideMenus.includes(key);

  return {
    sideBar,
    toggleSideBar,

    activeSideMenus,
    toggleSideMenu,
    isSideMenuActive,

    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,

    countStatType,
    setCountStatType,
  };
};
