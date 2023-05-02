import { useState } from "react";

const useFetch = <T extends unknown>() => {
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<Response>();
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<any>();

  const handle = (promise: Promise<Response>) => {
    setLoading(true);
    promise
      .then(async (response) => {
        setLoading(false);
        setRawResponse(response);
        const json = await response.json();
        setResponse(json);
      })
      .catch((e) => {
        setError(e);
      });
    return promise;
  };

  return {
    handle,
    loading,
    rawResponse,
    response,
    error,
  };
};

export default useFetch;
