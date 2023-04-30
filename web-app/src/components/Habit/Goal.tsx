import { useContext } from "react";
import Select from "../Select";
import { AppContext } from "../AppContext";

const Goal = () => {
  const { settings, saveSettings } = useContext(AppContext);

  const handleChange = (val: string) => {
    saveSettings({ ...settings, goal: val || undefined });
  };

  return (
    <div>
      Write goal
      <br />
      ~~~~~~~~~
      <div>
        <Select value={settings.goal || ""} onValueChange={handleChange}>
          <Select.Option value={""}>none</Select.Option>
          <Select.Option value={"short"}>short</Select.Option>
          <Select.Option value={"medium"}>medium</Select.Option>
          <Select.Option value={"long"}>long</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default Goal;
