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

const loadGoogleFont = async (family: string) => {
  await addStylesheet(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap`
  );
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
        "border border-primary border-opacity-20"
      )}
      {...restProps}
    />
  );
};

type SavedFont = {
  name: string;
  family: string;
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
    inbuilt: true,
  },
  {
    name: "Nanum Myeongjo",
    family: "'Nanum Myeongjo', serif",
    inbuilt: true,
  },
  {
    name: "IM Fell English",
    family: "'IM Fell English', serif",
    inbuilt: true,
  },
  {
    name: "Yomogi",
    family: "'Yomogi', cursive",
    inbuilt: true,
  },
];

const Page = () => {
  const { getState } = useContext(PluginContext);
  const { set, get } = getState("google-fonts");
  const [tmpName, setTmpName] = useState("");
  const [tmpFamily, setTmpFamily] = useState("");

  const fonts = get<SavedFont[]>("fonts") || [];
  const activeFont = get<SavedFont | undefined>("active-font");

  useEffect(() => {
    Event.track("google-fonts");
    [...defaultFonts, ...fonts].forEach((font) => loadGoogleFont(font.name));
  }, []);

  const handleAdd = () => {
    if (!tmpName || !tmpFamily) {
      return alert("Please enter both name and family name to add");
    }
    loadGoogleFont(tmpName);
    set("fonts", [...fonts, { name: tmpName, family: tmpFamily }]);
  };

  const handleFontClick = (font: SavedFont) => {
    if (font.name === "Default") {
      set("active-font", undefined);
    } else {
      set("active-font", font);
    }
  };

  const handleDelete = (font: SavedFont) => {
    set(
      "fonts",
      fonts.filter((f) => f.name !== font.name)
    );
  };

  return (
    <div className="space-y-4">
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
          href="https://twitter.com/pramodk73/status/1690655433231564800"
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
              "flex items-center space-x-2 p-2 cursor-pointer",
              "rounded",
              {
                "bg-primary bg-opacity-10": activeFont?.name === font.name,
                "hover:bg-primary hover:bg-opacity-5":
                  activeFont?.name !== font.name,
              }
            )}
            onClick={() => handleFontClick(font)}
          >
            <span>{font.name}</span>
            <span className="text-primary text-opacity-50">{font.family}</span>
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
      <div className="md:flex items-center md:space-x-2 space-y-2 md:space-y-0">
        <CustomInput
          placeholder="Name"
          value={tmpName}
          onChange={(e) => setTmpName(e.target.value)}
        />
        <CustomInput
          placeholder="Font family"
          value={tmpFamily}
          onChange={(e) => setTmpFamily(e.target.value)}
        />
        <Button onClick={handleAdd}>Add font</Button>
      </div>
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
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (activeFont) {
        await loadGoogleFont(activeFont.name);
        applyFontFamily(activeFont.family);
      }
    })();
  }, [note, activeFont]);

  return null;
};

export default GoogleFontsPlugin;
