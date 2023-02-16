"use client";

import { Scene } from "@/types/scene";
import { Collection, Refer } from "@/types/types";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ScenesSidebar from "./ScenesSidebar";

export default function NoSceneSelectedPage() {
  const [scenes, setScenes] = useState<Collection<Scene>>();
  const [selectedScene, setSelectedScene] = useState<Refer<Scene>>();

  useEffect(() => {
    fetch("/api/scenes")
      .then((res) => res.json())
      .then((data) => setScenes(data.results));
  }, []);

  if (!scenes) return <Loading />;

  return (
    <div className="flex flex-row h-full">
      <ScenesSidebar scenes={scenes} onSelect={(id) => setSelectedScene(id)} />
      <div className="p-4 w-full">
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <span className="text-lg md:text-xl text-zinc-600 font-med">
            No scene selected
          </span>
        </div>
      </div>
    </div>
  );
}
