import slugify from "slugify";

export const slugifyTitle = (title: string) => {
  return (
    "title-" +
    slugify(title, {
      lower: true,
      remove: /[*+~.()'"!:@#]/g,
      strict: true,
    })
  );
};
