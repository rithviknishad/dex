"use client";

export default function ValueProvider<T>({
  value,
  context,
  children,
}: {
  value: T;
  context: React.Context<T>;
  children: React.ReactNode;
}) {
  return <context.Provider value={value}>{children}</context.Provider>;
}
