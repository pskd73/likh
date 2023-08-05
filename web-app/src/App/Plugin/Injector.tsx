import { PluginContext, usePlugins } from "./Context";
import { plugins } from "./List";
import React, { PropsWithChildren } from "react";

const PluginInjector = ({ children }: PropsWithChildren) => {
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

export default PluginInjector;
