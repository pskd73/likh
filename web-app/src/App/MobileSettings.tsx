import { WithTitle } from "./SidePanel/Common";
import Storage from "src/App/SidePanel/Storage";
import { ColorTheme, themes } from "./SidePanel/Settings";
import { useContext } from "react";
import { EditorContext } from "./Context";

const MobileSettings = () => {
  const { colorTheme, setColorTheme } = useContext(EditorContext);

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
    </div>
  );
};

export default MobileSettings;
