import { useState } from "react";

type State = "idle" | "loading";

const useFetch = <T extends unknown>() => {
  const [state, setState] = useState<State>("idle");
  const [rawResponse, setRawResponse] = useState<Response>();
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<any>();
  const [hits, setHits] = useState(0);

  const handle = (promise: Promise<Response>) => {
    setState("loading");
    promise
      .then(async (response) => {
        setRawResponse(response);
        if (response.status === 200) {
          const json = await response.json();
          setResponse(json);
          setState("idle");
        }
        setHits((hits) => hits + 1);
      })
      .catch((e) => {
        setError(e);
        setState("idle");
        setHits((hits) => hits + 1);
      });
    return promise;
  };

  return {
    handle,
    state,
    loading: state === "loading",
    rawResponse,
    response,
    error,
    hits,
  };
};

export default useFetch;
