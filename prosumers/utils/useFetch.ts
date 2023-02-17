import { useEffect, useState } from "react";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => res.json());

export default function useFetch<T>(url: string) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();

  useEffect(() => {
    setLoading(true);
    fetcher(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url]);

  return { loading, data };
}
