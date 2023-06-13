import { useMemo, useState } from "react";

function getJsonFromUrl(url?: string) {
  if (!url) url = window.location.search;
  var query = url.substr(1);
  var result: Record<string, any> = {};
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    if (item[0]) {
      result[item[0]] = decodeURIComponent(item[1]);
    }
  });
  return result;
}

function getConfig<T>(key: string): T | undefined {
  return getJsonFromUrl()[key];
}

function setConfig(key: string, value: any) {
  const config = getJsonFromUrl();
  config[key] = value;
  const paramsStr = new URLSearchParams(config).toString();
  window.history.replaceState(
    {
      info: "Updated from app",
    },
    "Updated title",
    `${window.location.origin}${window.location.pathname}?${paramsStr}`
  );
}

const listSerialize = (list?: any[]) => {
  if (list === undefined) return undefined;
  return list.join(",");
};

const listDeserialize = (str?: string) => {
  if (str === undefined) return undefined;
  return str.split(",");
};

const booleanSerialize = (val?: boolean) => {
  if (val === undefined) return undefined;
  return String(val);
};

const booleanDeserialize = (val?: string) => {
  if (val === undefined) return undefined;
  return val === "true";
};

export const PersistedState = (
  key: string,
  options?: { type?: "premitive" | "list" | "boolean" }
) => {
  options = options || {
    type: "premitive",
  };

  let [serialize, deserialize] = [(a: any) => a, (a: any) => a];
  if (options.type === "list") {
    serialize = listSerialize;
    deserialize = listDeserialize;
  } else if (options.type === "boolean") {
    serialize = booleanSerialize;
    deserialize = booleanDeserialize;
  }

  const existingConfig = deserialize(getConfig(key));

  const useHook = <T>(
    value: T
  ): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [currentValue, setCurrentValue] = useState<T>(
      existingConfig !== undefined ? (existingConfig as T) : value
    );
    const liveValue = useMemo(() => {
      const updatedValue = currentValue !== undefined ? currentValue : value;
      setConfig(key, serialize(updatedValue));
      return updatedValue;
    }, [currentValue, value]);

    return [liveValue, setCurrentValue];
  };

  return { hook: useHook, value: existingConfig };
};
