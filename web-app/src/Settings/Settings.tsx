import { PropsWithChildren, useContext } from "react";
import { Select } from "../comps/Form";
import PlainSelect from "../components/Select";
import { AppContext } from "../components/AppContext";
import { Helmet } from "react-helmet";

const Item = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>;
};

const Label = ({ children }: PropsWithChildren) => {
  return <div className="w-1/4">{children}</div>;
};

const Value = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

const Settings = () => {
  const { settings, saveSettings } = useContext(AppContext);

  const handleFontChange = (font: string) => {
    saveSettings({ ...settings, font });
  };

  const handleTypeSoundsChange = (onOff: string) => {
    saveSettings({ ...settings, typeSounds: onOff === "on" });
  };

  return (
    <div className="space-y-4">
      <Helmet>
        <title>Settings - Retro Note</title>
      </Helmet>
      <Item>
        <Label>App font</Label>
        <Value>
          <Select
            value={settings.font || "SpecialElite"}
            onChange={(e) => handleFontChange(e.target.value)}
          >
            <option>Special Elite</option>
          </Select>
        </Value>
      </Item>
      <Item>
        <Label>Typing sounds</Label>
        <Value>
          <PlainSelect
            value={settings.typeSounds ? "on" : "off"}
            onValueChange={(val) => handleTypeSoundsChange(val)}
          >
            <PlainSelect.Option value={"on"}>on</PlainSelect.Option>
            <PlainSelect.Option value={"off"}>off</PlainSelect.Option>
          </PlainSelect>
        </Value>
      </Item>
    </div>
  );
};

export default Settings;
