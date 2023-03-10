"use client";

import Modal from "@/components/Modal";
import { Scene } from "@/types/scene";
import { Collection } from "@/types/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CreateScene from "./CreateScene";
import SceneCard from "./SceneSidebarCard";

export default function ScenesSidebar() {
  const pathName = usePathname();
  const [scenes, setScenes] = useState<Collection<Scene>>();
  const [createScene, setCreateScene] = useState(false);

  useEffect(() => {
    if (pathName === "/dashboard/scenes" || scenes === undefined) {
      fetch("/api/scenes")
        .then((res) => res.json())
        .then((data) => setScenes(data.results));
    }
  }, [pathName, scenes]);

  return (
    <>
      <Modal
        opened={createScene}
        onClose={() => setCreateScene(false)}
        title="Scene: Create"
      >
        <CreateScene
          onCreate={(id, scene) => {
            setCreateScene(false);
            setScenes((scenes) => ({ ...scenes, [id]: scene }));
          }}
        />
      </Modal>
      <div className="sidebar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-brand-500 text-lg font-bold">Scenes</h2>
          <button
            className="primary-button"
            onClick={() => setCreateScene(true)}
          >
            New Scene
          </button>
        </div>

        {scenes === undefined ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={"item-" + i}
                className="flex w-full h-12 bg-zinc-800 animate-pulse"
              />
            ))}
          </ul>
        ) : Object.keys(scenes).length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <span className="text-lg md:text-xl text-zinc-600 font-medium">
              No scenes
            </span>
            <span className="text-sm md:text-base text-zinc-500 font-medium">
              Create a scene to get started
            </span>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {Object.entries(scenes).map(([id, scene]) => (
              <li key={"item-" + id}>
                <SceneCard scene={scene} id={id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
