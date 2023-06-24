import { CSSProperties } from "react";
import { CustomElement } from "../Core";
import { isMobile } from "../../device";
import classNames from "classnames";

const SlateElement = ({
  element,
  attributes,
  children,
  // imgRef,
  // imgUrl,
  // imgUri,
  quote,
  // titleLevel,
  // titleSlug,
  // listLevel,

  img,
  title,
  list,
}: {
  attributes: any;
  children: any;
  element: CustomElement;
  // imgRef: HTMLImageElement | null;
  // imgUrl?: string;
  // imgUri?: string;
  quote?: boolean;
  // titleLevel?: number;
  // titleSlug?: string;
  // listLevel?: number;

  img?: {
    ref?: HTMLImageElement | null;
    url?: string;
    uri?: string;
  };

  title?: {
    level?: number;
    slug?: string;
  };

  list?: {
    level?: number;
  };
}) => {
  const style: CSSProperties = {};
  if (list !== undefined && list.level !== undefined) {
    style.marginLeft = (isMobile ? 20 : 40) * (list.level + 1);
  }

  if (element.type === "code-block") {
    return (
      <pre
        {...attributes}
        className="mb-4 bg-primary-700 bg-opacity-5 p-4 rounded-md whitespace-break-spaces"
        spellCheck={false}
      >
        {children}
      </pre>
    );
  }

  return (
    <>
      {img?.url && (
        <div
          style={{ userSelect: "none" }}
          contentEditable={false}
          className="flex flex-col items-center w-full"
        >
          <img
            ref={(r) => {
              console.log("here")
              img.ref = r
            }}
            src={img.uri || img.url}
            className="rounded-lg"
            alt="Retro Note"
          />
        </div>
      )}
      <p
        {...attributes}
        className={classNames({
          "px-6 bg-primary-700 bg-opacity-10 py-2 italic": quote,
          "border-l-4 border-primary-700 border-opacity-30": quote,
          "pb-10": img?.url,
          "mb-2": !quote,
        })}
        style={style}
        data-title-level={title?.level}
        data-title-slug={title?.slug}
      >
        <span
          className={classNames({
            "py-2 text-center text-sm block opacity-50 break-all": img?.url,
          })}
        >
          {children}
        </span>
      </p>
    </>
  );
};

export default SlateElement;
