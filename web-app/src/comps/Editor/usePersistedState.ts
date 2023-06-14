import { useMemo, useState } from "react";

function getLocalState() {
  return JSON.parse(localStorage.getItem("state") || "{}");
}

function updateLocalState(state: Record<string, any>) {
  localStorage.setItem("state", JSON.stringify(state));
}

function getConfig<T>(key: string): T | undefined {
  return getLocalState()[key];
}

function setConfig(key: string, value: any) {
  if (value !== undefined) {
    const localState = getLocalState();
    localState[key] = value;
    updateLocalState(localState);
  }
}

export const PersistedState = <T>(key: string) => {
  const existingConfig = getConfig(key);

  const useHook = <T>(
    value: T
  ): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [currentValue, setCurrentValue] = useState<T>(
      existingConfig !== undefined ? (existingConfig as T) : value
    );
    const liveValue = useMemo(() => {
      const updatedValue = currentValue !== undefined ? currentValue : value;
      setConfig(key, updatedValue);
      return updatedValue;
    }, [currentValue, value]);

    return [liveValue, setCurrentValue];
  };

  return { hook: useHook, value: existingConfig as T };
};
