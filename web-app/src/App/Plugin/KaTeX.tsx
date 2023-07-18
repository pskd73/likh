import classNames from "classnames";
import { RNPluginCreator } from "./type";

declare var katex: any;

const blockedKatex = {
  pattern: /^\$\$[^$]*\$\$$/m,
};
const inlineKatex = {
  pattern: /\$[^$]*\$/m,
};

let id = 0;
const getNextId = () => {
  id += 1;
  return id;
};

const KaTeXPlugin: RNPluginCreator = () => {
  return {
    name: "KaTeX",
    version: 1,
    grammer: (grammer) => ({
      blockedKatex,
      inlineKatex,
      quote: {
        ...grammer.quote,
        inside: {
          ...(grammer.quote as any).inside,
          inlineKatex,
        },
      },
    }),
    leafMaker: ({ attributes, children, leaf }) => {
      if (leaf.blockedKatex || leaf.inlineKatex) {
        const id = `katex-${getNextId()}`;
        const raw = leaf.blockedKatex
          ? leaf.text.substring(2, leaf.text.length - 2)
          : leaf.text.substring(1, leaf.text.length - 1);
        setTimeout(() => {
          try {
            katex.render(raw, document.getElementById(id), {
              throwOnError: false,
            });
          } catch {}
        }, 100);
        return (
          <span
            {...attributes}
            className={classNames({
              "flex flex-col items-center": leaf.blockedKatex,
            })}
          >
            <span
              id={id}
              className="select-none"
              contentEditable={false}
            />
            <span
              className={classNames("text-sm text-primary", {
                "text-opacity-20": !leaf.focused,
                "text-opacity-50": leaf.focused,
                "pl-1": leaf.inlineKatex,
                hidden: leaf.inlineKatex && !leaf.focused,
                "inline-block": leaf.inlineKatex && leaf.focused,
              })}
            >
              {children}
            </span>
          </span>
        );
      }
    },
  };
};

export default KaTeXPlugin;
