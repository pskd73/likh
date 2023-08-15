import { ComponentProps, useContext, useEffect, useState } from "react";
import { PluginContext } from "./Context";
import List from "../List";
import { EditorContext } from "../Context";
import Button from "src/comps/Button";
import { Input } from "src/comps/Form";
import { BiCheck, BiFont, BiTrash } from "react-icons/bi";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Event from "src/components/Event";

const NavLink = () => {
  const navigate = useNavigate();

  return (
    <List.Item withIcon onClick={() => navigate("/write/plugin/google-fonts")}>
      <List.Item.Icon>
        <BiFont />
      </List.Item.Icon>
      <span>Google fonts</span>
    </List.Item>
  );
};

function addStylesheet(url: string) {
  return new Promise<void>((resolve, reject) => {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
    link.onload = function () {
      resolve();
    };
    link.onerror = function () {
      reject();
    };
    document.getElementsByTagName("head")[0].appendChild(link);
  });
}

const loadGoogleFont = async (font: SavedFont) => {
  let link = `https://fonts.googleapis.com/css2?family=${font.name}&display=swap`;
  if (font.link) {
    link = font.link;
  }
  await addStylesheet(link);
};

const applyFontFamily = (fontFamily: string) => {
  const editorElem = document.querySelectorAll(".note-editor");
  editorElem.forEach((elem: any) => {
    elem.style.fontFamily = fontFamily;
  });
};

const CustomInput = ({ ...restProps }: ComponentProps<"input">) => {
  return (
    <Input
      type="text"
      className={classNames(
        "h-auto py-1 placeholder-primary placeholder-opacity-50",
        "border border-primary border-opacity-20",
        "max-w-sm w-full"
      )}
      {...restProps}
    />
  );
};

type SavedFont = {
  name: string;
  family: string;
  link?: string;
  inbuilt?: boolean;
};

const defaultFonts: SavedFont[] = [
  {
    name: "Default",
    family: "",
    inbuilt: true,
  },
  {
    name: "Roboto Mono",
    family: "'Roboto Mono', monospace",
    link: "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,600;1,400;1,600&display=swap",
    inbuilt: true,
  },
  {
    name: "Nanum Myeongjo",
    family: "'Nanum Myeongjo', serif",
    link: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@800&display=swap",
    inbuilt: true,
  },
  {
    name: "IM Fell English",
    family: "'IM Fell English', serif",
    link: "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap",
    inbuilt: true,
  },
  {
    name: "Yomogi",
    family: "'Yomogi', cursive",
    inbuilt: true,
  },
];

const extractLink = (importStr: string) => {
  const match = importStr.match(/@import url\('(.*)'\)/);
  return match ? match[1] : undefined;
};

const extractFontFamily = (cssStr: string) => {
  const match = cssStr.match(/font-family: (.*);/);
  const ff = cssStr.match(/font-family/g);
  return match && ff && ff.length === 1 ? match[1] : undefined;
};

const getSpaceWidth = (family: string) => {
  const s = document.createElement("span");
  const ed = document.body;

  ed.appendChild(s);
  s.innerHTML = "&nbsp;";
  s.style.position = "absolute";
  s.style.left = "-9999px";
  s.style.top = "-9999px";
  s.style.fontFamily = family;
  const width = s.getBoundingClientRect().width;
  s.remove();
  return width;
};

const AddFont = () => {
  const { getState } = useContext(PluginContext);
  const { set, get } = getState("google-fonts");
  const [name, setName] = useState("");
  const [css, setCss] = useState("");
  const [_import, setImport] = useState("");

  const fonts = get<SavedFont[]>("fonts") || [];

  const handleAdd = () => {
    if (!name || !css || !_import) {
      return alert("Please fill all the fields");
    }
    const link = extractLink(_import);
    if (!link) {
      return alert("Please paste valid @import");
    }
    const family = extractFontFamily(css);
    if (!family) {
      return alert("Please paste valid CSS. Only one font-family allowed");
    }
    const font = { name: name, link, family };
    loadGoogleFont(font);
    set("fonts", [...fonts, font]);
    setName("");
    setCss("");
    setImport("");
  };

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold mb-4 mt-6">Add new font</h2>
      <textarea
        placeholder="Paste @import"
        value={_import}
        onChange={(e) => setImport(e.target.value)}
        className={classNames(
          "border border-primary border-opacity-20",
          "outline-none rounded",
          "bg-primary bg-opacity-10 max-w-sm w-full",
          "p-2 placeholder-primary placeholder-opacity-50"
        )}
        rows={7}
      />
      <CustomInput
        placeholder="Paste CSS"
        value={css}
        onChange={(e) => setCss(e.target.value)}
      />
      <CustomInput
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleAdd}>Add font</Button>
    </div>
  );
};

const Page = () => {
  const { getState } = useContext(PluginContext);
  const { setSpaceWidth } = useContext(EditorContext);
  const { set, get } = getState("google-fonts");

  const fonts = get<SavedFont[]>("fonts") || [];
  const activeFont = get<SavedFont | undefined>("active-font");

  useEffect(() => {
    Event.track("google-fonts");
    [...defaultFonts, ...fonts].forEach(
      (font) => font.name !== "Default" && loadGoogleFont(font)
    );
  }, []);

  const handleFontClick = (font: SavedFont) => {
    if (font.name === "Default") {
      set("active-font", undefined);
    } else {
      set("active-font", font);
    }
    setSpaceWidth(getSpaceWidth(font.family));
  };

  const handleDelete = (font: SavedFont) => {
    set(
      "fonts",
      fonts.filter((f) => f.name !== font.name)
    );
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="text-3xl font-bold">Google Fonts</div>
      <p>
        Change the font of the notes. Apart from available fonts, you can add
        any of{" "}
        <a
          href="https://fonts.google.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Google Fonts
        </a>
        .{" "}
        <a
          href="https://twitter.com/pramodk73/status/1691305552381710337"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Here
        </a>{" "}
        is how you can add them
      </p>
      <hr />
      <ul className="w-full space-y-1">
        {[...defaultFonts, ...fonts].map((font, i) => (
          <li
            key={i}
            style={{
              fontFamily: font.family,
            }}
            className={classNames(
              "flex items-start justify-between space-x-2 p-2 cursor-pointer",
              "rounded",
              {
                "bg-primary bg-opacity-10": activeFont?.name === font.name,
                "hover:bg-primary hover:bg-opacity-5":
                  activeFont?.name !== font.name,
              }
            )}
            onClick={() => handleFontClick(font)}
          >
            <div>
              <span>{font.name}</span>
              <div className="text-primary text-opacity-50 text-xs">
                {font.family && <div>Family: {font.family}</div>}
                {font.link && <div>Link: {font.link}</div>}
              </div>
            </div>
            {activeFont?.name !== font.name && !font.inbuilt && (
              <Button
                className="text-xs"
                onClick={(e) => {
                  handleDelete(font);
                  e.stopPropagation();
                }}
              >
                <BiTrash />
              </Button>
            )}
            {activeFont?.name === font.name && (
              <span className="text-2xl">
                <BiCheck />
              </span>
            )}
          </li>
        ))}
      </ul>
      <hr />
      <AddFont />
    </div>
  );
};

const GoogleFontsPlugin = () => {
  const { register, getState } = useContext(PluginContext);
  const { note } = useContext(EditorContext);
  const { get } = getState("google-fonts");
  const activeFont = get<SavedFont | undefined>("active-font");

  useEffect(() => {
    register("google-fonts", {
      name: "Google Fonts",
      version: 1,
      pages: { "google-fonts": { page: <Page /> } },
      navigationItems: [<NavLink />],
      mobileSettingItems: [<NavLink />],
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (activeFont) {
        await loadGoogleFont(activeFont);
        applyFontFamily(activeFont.family);
      }
    })();
  }, [note, activeFont]);

  return null;
};

export default GoogleFontsPlugin;
