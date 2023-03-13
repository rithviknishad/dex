"use client";

import SceneSidebar from "./Sidebar";

export default function EditSceneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full w-full">
      <SceneSidebar />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
