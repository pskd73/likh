import { ComponentProps, PropsWithChildren, useContext, useState } from "react";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import { AppContext } from "../AppContext";
import { twMerge } from "tailwind-merge";
import Select from "../Select";
import { Font } from "../../type.d";

const Label = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div className={twMerge(className, "w-52")} {...restProps}>
      {children}
    </div>
  );
};

const SettingItem = ({ children }: PropsWithChildren) => {
  return <li className="flex">{children}</li>;
};

const Settings = () => {
  const { setActiveTray, setTrayOpen, trayOpen, settings, saveSettings } =
    useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("settings");
    setTrayOpen(!trayOpen);
  };

  const handleFontChange = (font: string) => {
    saveSettings({ ...settings, font });
  };

  const handleTypeSoundsChange = (onOff: string) => {
    saveSettings({ ...settings, typeSounds: onOff === "on" });
  };

  return (
    <div>
      <div className="p-4">
        <ul className="space-y-4">
          <SettingItem>
            <Label>App font</Label>
            <div>
              <Select
                value={settings.font || "SpecialElite"}
                onValueChange={handleFontChange}
              >
                {Object.keys(Font).map((fontKey) => (
                  <Select.Option key={fontKey} value={fontKey}>
                    {Font[fontKey as keyof typeof Font]}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </SettingItem>
          <SettingItem>
            <Label>Type sounds</Label>
            <div>
              <Select
                value={settings.typeSounds ? "on" : "off"}
                onValueChange={handleTypeSoundsChange}
              >
                <Select.Option value="on">on</Select.Option>
                <Select.Option value="off">off</Select.Option>
              </Select>
            </div>
          </SettingItem>
        </ul>
      </div>
      <Toolbar className="bg-white">
        <Toolbar.Title>
          <Clickable>
            <span onClick={handleTitleClick}>
              <TrayExpandIcon />
              Settings
            </span>
          </Clickable>
        </Toolbar.Title>
      </Toolbar>
    </div>
  );
};

export default Settings;
