import { useEffect, useState } from "react"

const useMemoAsync = <T>(func: () => Promise<T>, deps: any[]) => {
  const [val, setVal] = useState<T>();

  useEffect(() => {
    (async () => {
      setVal(await func());
    })();
  }, deps);

  return val;
}

export default useMemoAsync;
