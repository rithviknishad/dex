import { useEffect, useState } from "react";

const fetcher = (url: string, options?: RequestInit) => {
  const resolvedOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  return fetch(url, resolvedOptions).then((res) => res.json());
};

export default function useFetch<T>(url: string, options?: RequestInit) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();

  useEffect(() => {
    setLoading(true);
    fetcher(url, options).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, options]);

  return { loading, data };
}
