"use client";

import { useEffect, useState } from "react";
import Loading from "../Loading";

export default function FutureProvider<T>({
  future,
  context,
  children,
}: {
  future: Promise<T>;
  context: React.Context<T>;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    future.then(setValue);
  }, [future]);

  if (!value) return <Loading />;

  return <context.Provider value={value}>{children}</context.Provider>;
}
