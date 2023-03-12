"use client";

import React, { useState } from "react";

export default function useFormState<T extends object>(
  initialState: T
): [T, <K extends keyof T>(key: K, value: T[K]) => void] {
  const [state, setState] = useState<T>(initialState);

  const setValueOf = <K extends keyof T>(key: K, value: typeof state[K]) => {
    return setState((state) => ({ ...state, [key]: value }));
  };

  return [state, setValueOf];
}
