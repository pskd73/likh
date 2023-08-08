import { useContext, useEffect, useState } from "react";
import { PluginContext } from "./Context";
import Tooltip from "src/comps/Tooltip";
import { TbTextSpellcheck } from "react-icons/tb";
import Button from "src/comps/Button";
import { EditorContext } from "../Context";

const KEY = "spell-check";

const StatusBarIcon = () => {
  const { note } = useContext(EditorContext);
  const [enabled, setEnabled] = useState(false);

  const handleClick = () => {
    const elements = document.querySelectorAll("[contentEditable=true]");
    if (enabled) {
      elements.forEach((node) => node.setAttribute("spellcheck", "false"));
      setEnabled(false);
    } else {
      elements.forEach((node) => node.setAttribute("spellcheck", "true"));
      setEnabled(true);
    }
  };

  if (!note) return null;

  return (
    <Tooltip tip={"Toggle spell check"}>
      <Button lite={!enabled} className="rounded-none" onClick={handleClick}>
        <TbTextSpellcheck />
      </Button>
    </Tooltip>
  );
};

const SpellCheckPlugin = () => {
  const { register } = useContext(PluginContext);

  useEffect(() => {
    register(KEY, {
      name: "Spell Check",
      version: 1,
      statusBarIcons: [<StatusBarIcon />],
    });
  }, []);

  return null;
};

export default SpellCheckPlugin;
