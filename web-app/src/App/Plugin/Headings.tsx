import classNames from "classnames";
import { CustomGrammarValue } from "../grammer";
import { RNPluginCreator } from "./type";
import slugify from "slugify";

export const title: CustomGrammarValue = {
  pattern: /^#{1,6} .*$/m,
  inside: {
    hashes: /^#{1,6} /,
  },
};

const HeadingsPlugin: RNPluginCreator = () => {
  return {
    name: "Headings",
    version: 1,
    grammer: () => ({
      title,
    }),
    leafMaker: ({ children, attributes, leaf, text }) => {
      if (leaf.title) {
        const level = text.text.match(/^#{1,6} /)?.[0].trim().length;

        return (
          <span
            className={classNames("font-semibold", {
              "text-3xl": level === 1,
              "text-2xl": level === 2,
              "text-xl": level === 3,
              "text-lg": level === 4,
              "text-primary text-opacity-20": leaf.hashes,
              hidden: leaf.hashes && !leaf.titleFocused,
            })}
            {...attributes}
          >
            {children}
          </span>
        );
      }
    },
    elementMaker: ({ element, attributes, children, text }) => {
      const match = text.match(title.pattern);
      if (match) {
        const level = text.match(/^#{1,6} /)?.[0].trim().length;
        return (
          <p
            className={classNames("mt-4 mb-3")}
            {...attributes}
            data-title-level={level}
            data-title-slug={
              "title-" +
              slugify(text, {
                lower: true,
                remove: /[*+~.()'"!:@#]/g,
                strict: true,
              })
            }
          >
            {children}
          </p>
        );
      }
    },
  };
};

export default HeadingsPlugin;
