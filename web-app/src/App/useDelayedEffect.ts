import { DependencyList, EffectCallback, useEffect } from "react";

const useDelayedEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
  delay = 100
) => {
  useEffect(() => {
    setTimeout(() => {
      effect();
    }, delay);
  }, deps);
};

export default useDelayedEffect;
