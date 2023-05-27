import { createContext, useState } from "react";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

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
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

export const useEditor = () => {
  const [sideBar, setSideBar] = useState(false);
  const [activeSideMenus, setActiveSideMenus] = useState<string[]>(["notes"]);
  const [showStats, setShowStats] = useState(false);
  const [typewriterMode, setTypewriterMode] = useState(false);

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
    setTypewriterMode
  };
};
