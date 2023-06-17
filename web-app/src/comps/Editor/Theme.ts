export type Theme = {
  font: {
    base: string;
    title1: string;
    title2: string;
    title3: string;
  };
};

export const Themes: Record<string, Theme> = {
  Basic: {
    font: {
      base: "font-Inter text-regular",
      title1: "text-3xl",
      title2: "text-2xl",
      title3: "text-xl",
    },
  },
  Lite: {
    font: {
      base: "font-Cormorant text-xl",
      title1: "text-4xl",
      title2: "text-3xl",
      title3: "text-2xl",
    },
  },
};
