import { DependencyList, RefObject, useEffect, useMemo, useState } from "react";

export const useMiddle = (
  ref: RefObject<HTMLDivElement>,
  deps?: DependencyList
) => {
  const height = useMemo(() => window.innerHeight, []);
  const [paddingTop, setPaddingTop] = useState(height / 2);

  useEffect(() => {
    update();
    scroll();
  }, deps);

  const update = () => {
    if (ref.current) {
      setPaddingTop(Math.max(0, height / 2 - ref.current.clientHeight));
    }
  };

  const scroll = (initial?: boolean) => {
    document.body.scrollTo({
      top: 10000000,
      behavior: "smooth",
    });
  };

  return {
    update,
    scroll,
    style: {
      paddingTop,
      paddingBottom: height / 2,
    },
  };
};
