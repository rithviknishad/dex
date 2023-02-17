"use client";

import Modal from "@/components/Modal";
import { Scene } from "@/types/scene";
import { Collection } from "@/types/types";
import { useState } from "react";
import CreateScene from "./CreateScene";
import SceneCard from "./SceneSidebarCard";

interface Props {
  scenes: Collection<Scene>;
}

export default function ScenesSidebar({ scenes }: Props) {
  const [createScene, setCreateScene] = useState(false);

  return (
    <>
      <Modal
        opened={createScene}
        onClose={() => setCreateScene(false)}
        title="Scene: Create"
      >
        <CreateScene onCreate={() => setCreateScene(false)} />
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

        {Object.keys(scenes).length === 0 ? (
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
