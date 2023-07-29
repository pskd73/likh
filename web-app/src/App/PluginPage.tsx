import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { EditorContext } from "./Context";

const PluginPage = () => {
  const { plugins } = useContext(EditorContext);
  const { pluginUrl } = useParams();
  const [plugin, children] = useMemo(() => {
    const plugin = plugins.find((plugin) => plugin.page?.url === pluginUrl);
    return [plugin, plugin?.page?.element];
  }, [pluginUrl]);

  return <div>{children}</div>;
};

export default PluginPage;
