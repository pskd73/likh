import { PropsWithChildren, ReactElement, createContext, useContext, useState } from "react";
import { EditorContext } from "../Context";
import { plugins } from "./List";
import React from "react";

export const PluginContext = createContext({} as ReturnType<typeof usePlugins>);

export type Plugin = {
  name: string;
  version: number;
  pages?: Record<string, { page: ReactElement }>;
  statusBarIcons?: ReactElement[];
  noteMenuItems?: ReactElement[];
  navigationItems?: ReactElement[];
  mobileSettingItems?: ReactElement[];
};

export const usePlugins = () => {
  const { usePluginState: pluginState } = useContext(EditorContext);
  const [plugins, setPlugins] = useState<Record<string, Plugin>>({});

  const register = (key: string, plugin: Plugin) => {
    setPlugins((ps) => ({ ...ps, [key]: plugin }));
  };

  const getState = (pluginKey: string) => {
    const get = <T extends unknown>(key: string): T | undefined => {
      const [state] = pluginState<any>(pluginKey);
      if (!state) return undefined;
      return state[key];
    };

    const set = <T extends unknown>(key: string, value: T) => {
      const [state, setState] = pluginState<any>(pluginKey);
      setState({
        ...state,
        [key]: value,
      });
    };

    return { get, set };
  };

  return { plugins, register, getState };
};

export const WithPlugins = ({ children }: PropsWithChildren) => {
  const pluginState = usePlugins();

  return (
    <PluginContext.Provider value={pluginState}>
      {plugins.map((plugin, i) => (
        <React.Fragment key={i}>{plugin}</React.Fragment>
      ))}
      {children}
    </PluginContext.Provider>
  );
};