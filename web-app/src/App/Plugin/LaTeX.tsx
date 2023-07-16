import classNames from "classnames";
import { RNPluginCreator } from "./type";
import grammer from "../grammer";

declare var katex: any;

const blockedLatex = {
  pattern: /^\$\$[^$]*\$\$$/m,
};
const inlineLatex = {
  pattern: /\$[^$]*\$/m,
};

let id = 0;
const getNextId = () => {
  id += 1;
  return id;
};

const LaTeXPlugin: RNPluginCreator = () => {
  return {
    name: "LaTeX",
    version: 1,
    grammer: {
      blockedLatex,
      inlineLatex,
      list: {
        ...grammer.list,
        inside: {
          ...(grammer.list as any).inside,
          inlineLatex,
        },
      },
      quote: {
        ...grammer.quote,
        inside: {
          ...(grammer.quote as any).inside,
          inlineLatex,
        },
      },
    },
    leafMaker: ({ attributes, children, leaf }) => {
      if (leaf.blockedLatex || leaf.inlineLatex) {
        const id = `latex-${getNextId()}`;
        const raw = leaf.blockedLatex
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
              "flex flex-col items-center": leaf.blockedLatex,
            })}
          >
            <span
              id={id}
              className="mb-4 select-none"
              contentEditable={false}
            />
            <span
              className={classNames("text-sm text-primary", {
                "text-opacity-20": !leaf.focused,
                "text-opacity-50": leaf.focused,
                "pl-1": leaf.inlineLatex,
                hidden: leaf.inlineLatex && !leaf.focused,
                "inline-block": leaf.inlineLatex && leaf.focused,
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

export default LaTeXPlugin;
