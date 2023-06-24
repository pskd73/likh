import { BiBrush, BiCollapseVertical, BiStats } from "react-icons/bi";
import List from "../List";
import { ListContainer, Title } from "./Common";
import Toggle from "../../Toggle";
import { ComponentProps, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Themes } from "../Theme";
import classNames from "classnames";
import { EditorContext } from "../Context";

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
          "px-3 h-8 border-primary-700 border-2 cursor-pointer",
          "rounded flex justify-center items-center",
          "hover:bg-primary-700 hover:bg-opacity-5 active:bg-opacity-10",
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

const Settings = () => {
  const {
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
    themeName,
    setThemeName,
  } = useContext(EditorContext);

  return (
    <div>
      <Title>Settings</Title>
      <ListContainer>
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
                <div className="mb-2">Theme</div>
                <div className="flex space-x-2">
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
                </div>
              </div>
            </div>
          </List.Item>
        </List>
      </ListContainer>
    </div>
  );
};

export default Settings;
