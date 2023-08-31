import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { EditorContext } from "./Context";
import { PluginContext } from "./Plugin/Context";

const PluginPage = () => {
  const { plugins } = useContext(EditorContext);
  const { plugins: newPlugins } = useContext(PluginContext);
  const { pluginUrl } = useParams();
  const page = useMemo(() => {
    const plugin = plugins.find((plugin) => plugin.page?.url === pluginUrl);
    let element = plugin?.page?.element;
    if (!element && pluginUrl) {
      const _plugin = Object.values(newPlugins)
        .filter((p) => p.pages)
        .find((plugin) => plugin.pages![pluginUrl]);
      if (_plugin) {
        element = _plugin.pages![pluginUrl].page;
      }
    }
    return element;
  }, [pluginUrl, plugins, newPlugins]);

  return <div className="p-4">{page}</div>;
};

export default PluginPage;
