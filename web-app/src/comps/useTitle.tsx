import { useEffect, useMemo } from "react";

export const useTitle = () => {
  const previous = useMemo(() => document.title, []);

  useEffect(() => {
    return () => {
      document.title = previous;
    };
  }, []);

  const setTitle = (title: string) => {
    document.title = title;
  };

  return { setTitle };
};
