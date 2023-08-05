import { WithTitle } from "./SidePanel/Common";
import Storage from "src/App/SidePanel/Storage";
import { ColorTheme, themes } from "./SidePanel/Settings";
import { useContext, useMemo } from "react";
import { EditorContext } from "./Context";
import { PluginContext } from "./Plugin/Context";
import List from "./List";
import React from "react";

const MobileSettings = () => {
  const { colorTheme, setColorTheme } = useContext(EditorContext);
  const { plugins } = useContext(PluginContext);
  const pluginItems = useMemo(() => {
    const btns = Object.values(plugins)
      .map((p) => p.mobileSettingItems)
      .filter((items) => items?.length)
      .reduce((p, c) => [...p!, ...c!], []);
    return btns || [];
  }, [plugins]);

  return (
    <div className="space-y-6 pb-20">
      <WithTitle noPadding title="Theme">
        <div className="px-2">
          <div className="flex space-x-4">
            {themes.map((theme) => (
              <div key={theme}>
                <ColorTheme
                  theme={`theme-${theme}`}
                  active={colorTheme === theme}
                  onClick={() => setColorTheme(theme)}
                />
              </div>
            ))}
          </div>
        </div>
      </WithTitle>
      <WithTitle noPadding title="Sync" active={false}>
        <div>
          <Storage />
        </div>
      </WithTitle>

      {pluginItems.length > 0 && (
        <WithTitle noPadding title="More" active>
          <List>
            {pluginItems.map((item, i) => (
              <React.Fragment key={i}>{item}</React.Fragment>
            ))}
          </List>
        </WithTitle>
      )}
    </div>
  );
};

export default MobileSettings;
