import { CSSProperties } from "react";
import { CustomElement } from "../Core";
import { isMobile } from "../../device";
import classNames from "classnames";

const SlateElement = ({
  element,
  attributes,
  children,
  quote,
  img,
  title,
  list,
}: {
  attributes: any;
  children: any;
  element: CustomElement;
  quote?: boolean;
  img?: {
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
    const paddingWidth = 40 * (list.level + 1);
    return (
      <p {...attributes}>
        <span className="inline-flex flex-shrink-0">
          <span contentEditable={false} style={{ width: paddingWidth }} />
          <span>{children}</span>
        </span>
      </p>
    );
  }

  if (element.type === "code-block") {
    return (
      <pre
        {...attributes}
        className="mb-4 bg-primary bg-opacity-5 p-4 rounded-md whitespace-break-spaces"
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
            src={img.uri || img.url}
            className="rounded-lg"
            alt="Retro Note"
          />
        </div>
      )}
      <p
        {...attributes}
        className={classNames({
          "px-6 bg-primary bg-opacity-10 py-2 italic": quote,
          "border-l-4 border-primary border-opacity-30": quote,
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
