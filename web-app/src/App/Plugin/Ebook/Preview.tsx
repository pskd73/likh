import classNames from "classnames";
import { ComponentProps, KeyboardEventHandler, useEffect, useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const loadJS = (file: string) => {
  var jsElm = document.createElement("script");
  jsElm.type = "application/javascript";
  jsElm.src = file;
  document.body.appendChild(jsElm);
};

const NavContainer = ({ children, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      className={classNames(
        "text-4xl flex justify-center items-center",
        "bg-primary bg-opacity-5 hover:bg-opacity-10",
        "cursor-pointer"
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

export const Preview = ({ epub }: { epub: unknown }) => {
  const render = useRef<any>(null);

  useEffect(() => {
    loadJS("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js");
    loadJS("https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js");
  }, []);

  useEffect(() => {
    const elem = document.getElementById("ebook-preview");
    if (elem && epub) {
      elem.innerHTML = "";
      const book = (window as any).ePub(epub, { encoding: "binary" });
      render.current = book.renderTo("ebook-preview", {
        width: 600,
        height: 700,
      });
      render.current!.display();
    }
  }, [epub]);

  const handleLeft = () => {
    if (render.current) {
      render.current.prev();
    }
  }

  const handleRight = () => {
    if (render.current) {
      render.current.next();
    }
  }

  return (
    <div className="flex">
      <NavContainer onClick={handleLeft}>
        <BiChevronLeft />
      </NavContainer>
      <div id="ebook-preview" className="bg-primary bg-opacity-20 py-4" />
      <NavContainer onClick={handleRight}>
        <BiChevronRight />
      </NavContainer>
    </div>
  );
};
