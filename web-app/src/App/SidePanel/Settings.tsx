import { BiBrush, BiCollapseVertical, BiStats } from "react-icons/bi";
import List from "src/App/List";
import { ListContainer, Title } from "src/App/Home/Common";
import Toggle from "src/comps/Toggle";
import { ComponentProps, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Themes } from "src/App/Theme";
import classNames from "classnames";
import { EditorContext } from "src/App/Context";
import { WithTitle } from "./Common";

const ThemeBox = ({
  children,
  className,
  themeName,
  active,
  ...restProps
}: ComponentProps<"div"> & { themeName: string; active: boolean }) => {
  const theme = Themes[themeName];

  return (
    <div
      className={twMerge(
        classNames(
          theme.font.base,
          "px-3 h-8 border-primary border-2 cursor-pointer",
          "rounded flex justify-center items-center",
          "hover:bg-primary hover:bg-opacity-5 active:bg-opacity-10",
          "transition-all",
          {
            "border-opacity-30": !active,
            "border-opacity-80": active,
          }
        ),
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

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
  const {
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
    themeName,
    setThemeName,
    colorTheme,
    setColorTheme,
  } = useContext(EditorContext);

  const themes = ["base", "dark", "accent", "secondary"];

  return (
    <WithTitle title="Settings" active>
      <List>
        <List.Item noHover className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <BiStats />
            <span>Stats</span>
          </div>
          <Toggle
            id="stats"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
          />
        </List.Item>
        <List.Item noHover className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <BiCollapseVertical />
            <span>Typewriter mode</span>
          </div>
          <Toggle
            id="typewriterMode"
            checked={typewriterMode}
            onChange={(e) => setTypewriterMode(e.target.checked)}
          />
        </List.Item>
        <List.Item noHover>
          <div className="flex space-x-1">
            <BiBrush className="mt-1" />
            <div>
              <div>Theme</div>
              {/* <div className="flex space-x-2">
                <ThemeBox
                  themeName="Basic"
                  onClick={() => setThemeName("Basic")}
                  active={themeName === "Basic"}
                >
                  Basic
                </ThemeBox>
                <ThemeBox
                  themeName="Serif"
                  onClick={() => setThemeName("Serif")}
                  active={themeName === "Serif"}
                >
                  Serif
                </ThemeBox>
              </div> */}
              <div className="flex space-x-4 py-4">
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
          </div>
        </List.Item>
      </List>
    </WithTitle>
  );
};

export default Settings;
