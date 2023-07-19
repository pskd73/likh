import List from "src/App/List";
import { ComponentProps, useContext } from "react";
import classNames from "classnames";
import { EditorContext } from "src/App/Context";
import { WithTitle } from "./Common";

const ColorTheme = ({
  theme,
  active,
  ...restProps
}: ComponentProps<"div"> & { theme: string; active: boolean }) => {
  return (
    <div
      className={classNames(
        "w-6 h-6 rounded-full flex overflow-hidden border-2 border-primary",
        "cursor-pointer",
        { "border-opacity-100": active, "border-opacity-30": !active }
      )}
      {...restProps}
    >
      <div className={classNames("w-1/2 bg-base", theme)} />
      <div className={classNames("w-1/2 bg-primary", theme)} />
    </div>
  );
};

const Settings = () => {
  const { colorTheme, setColorTheme } = useContext(EditorContext);

  const themes = ["base", "dark", "accent", "secondary"];

  return (
    <WithTitle title="">
      <List>
        <List.Item noHover>
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
        </List.Item>
      </List>
    </WithTitle>
  );
};

export default Settings;
