import { useContext, useEffect } from "react";
import { BiBook } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { FolderItem } from "src/App/Folders";
import { PluginContext } from "../Context";
import { Page } from "./Page";

const NavItem = () => {
  const navigate = useNavigate();
  const { pluginUrl } = useParams();

  return (
    <FolderItem
      level={0}
      label={"Make Ebook"}
      icon={<BiBook />}
      onClickKind={() => navigate("/write/plugin/ebook")}
      active={pluginUrl === "ebook"}
    />
  );
};

const EBookPlugin = () => {
  const { register } = useContext(PluginContext);

  useEffect(() => {
    register("epug", {
      name: "Epub",
      version: 1,
      navigationItems: [<NavItem />],
      pages: {
        ebook: { page: <Page /> },
      },
    });
  }, []);

  return null;
};

export default EBookPlugin;