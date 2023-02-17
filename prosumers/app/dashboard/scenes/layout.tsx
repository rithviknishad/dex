"use client";

import { Scene } from "@/types/scene";
import { Collection } from "@/types/types";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ScenesSidebar from "./ScenesSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scenes, setScenes] = useState<Collection<Scene>>();

  useEffect(() => {
    fetch("/api/scenes")
      .then((res) => res.json())
      .then((data) => setScenes(data.results));
  }, []);

  if (!scenes) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row h-full w-full">
      <ScenesSidebar scenes={scenes} />
      {children}
    </div>
  );
}
