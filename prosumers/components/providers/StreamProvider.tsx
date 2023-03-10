"use client";

import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Loading from "../Loading";

export default function StreamProvider<T>({
  source,
  context,
  children,
}: {
  source: ReturnType<typeof ref>;
  context: React.Context<T | null>;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<T | null>();

  useEffect(() => {
    const unsubscribe = onValue(source, (snapshot) => {
      setValue(snapshot.val());
    });

    return () => unsubscribe();
  }, [source]);

  if (value === undefined) return <Loading />;

  return <context.Provider value={value}>{children}</context.Provider>;
}
