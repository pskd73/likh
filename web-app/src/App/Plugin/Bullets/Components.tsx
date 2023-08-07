import classNames from "classnames";
import { PropsWithChildren } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { CustomEditor } from "src/App/Core/Core";
import { ParsedListText, toggleCheckbox } from "src/App/Core/List";
import { toggleItem } from "./utils";

export const Space = ({
  i,
  parsed,
  isParent,
  collapsed,
  length,
}: {
  parsed: ParsedListText;
  i: number;
  isParent: boolean;
  collapsed: boolean;
  length: number;
}) => {
  return (
    <span
      key={i}
      contentEditable={false}
      style={{ width: 40 }}
      className={classNames(
        "flex-shrink-0 inline-flex justify-end items-start"
      )}
    >
      {((isParent && !collapsed) || i < length - 1) && (
        <span
          className={classNames("bg-primary bg-opacity-20")}
          style={{
            width: 1,
            marginRight: 8,
            marginTop: i === parsed.level ? 24 : 0,
            height: i === parsed.level ? "calc(100% - 24px)" : "100%",
          }}
        />
      )}
    </span>
  );
};

export const CollapseButton = ({
  editor,
  element,
  leaf,
}: {
  editor: CustomEditor;
  element: any;
  leaf: any;
}) => {
  return (
    <span
      contentEditable={false}
      className={classNames(
        "select-none cursor-pointer",
        "text-primary text-opacity-50"
      )}
      onClick={(e) => {
        toggleItem(editor, [leaf.path[0]], element);
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {(element as any).collapsed ? <BiChevronRight /> : <BiChevronDown />}
    </span>
  );
};

export const PlainBullet = ({
  children,
  parsed,
  leaf,
}: PropsWithChildren & { parsed: ParsedListText; leaf: any }) => {
  return (
    <span className="text-primary text-opacity-50 self-baseline">
      <span
        className={classNames("select-none", {
          hidden: leaf.bulletFocused,
        })}
        contentEditable={false}
      >
        •
      </span>
      <span className={classNames({ hidden: !leaf.bulletFocused })}>
        {children}
      </span>
    </span>
  );
};

export const OrderedBullet = ({ children }: PropsWithChildren) => {
  return (
    <span className="text-primary text-opacity-50 self-baseline">
      {children}
    </span>
  );
};

export const CheckboxIcon = ({ parsed }: { parsed: ParsedListText }) => {
  if ([" ", "x"].includes(parsed.checkboxType!)) {
    return (
      <input
        type="checkbox"
        checked={parsed.checkboxType === "x"}
        readOnly
        className="outline-none cursor-pointer"
      />
    );
  }
  if (parsed.checkboxType === "/") {
    return <span>👎</span>;
  }
  if (parsed.checkboxType === "b") {
    return <span>🔖</span>;
  }
  return null;
};

export const CheckboxBullet = ({
  children,
  parsed,
  leaf,
  editor,
}: PropsWithChildren & {
  parsed: ParsedListText;
  leaf: any;
  editor: CustomEditor;
}) => {
  return (
    <span className="self-baseline">
      <span
        className={classNames("select-none", {
          hidden: leaf.bulletFocused,
        })}
        contentEditable={false}
        onClick={() => toggleCheckbox(editor, leaf.path)}
      >
        <CheckboxIcon parsed={parsed} />
      </span>
      <span
        className={classNames("text-primary text-opacity-50", {
          hidden: !leaf.bulletFocused,
        })}
      >
        {children}
      </span>
    </span>
  );
};

export const Bullet = ({
  children,
  parsed,
  leaf,
  editor,
  collapsible,
  element,
}: PropsWithChildren & {
  parsed: ParsedListText;
  leaf: any;
  editor: CustomEditor;
  collapsible?: boolean;
  element: any;
}) => {
  const getBullet = () => {
    if (parsed.type === "unordered" && !parsed.checkbox) {
      return (
        <PlainBullet parsed={parsed} leaf={leaf}>
          {children}
        </PlainBullet>
      );
    }
    if (parsed.type === "unordered" && parsed.checkbox) {
      return (
        <CheckboxBullet parsed={parsed} leaf={leaf} editor={editor}>
          {children}
        </CheckboxBullet>
      );
    }
    if (parsed.type === "ordered") {
      return <OrderedBullet>{children}</OrderedBullet>;
    }

    return <span>{children}</span>;
  };

  return (
    <span className="inline-flex items-center space-x-1">
      {collapsible && !leaf.bulletFocused && (
        <CollapseButton editor={editor} element={element} leaf={leaf} />
      )}
      {getBullet()}
    </span>
  );
};
