"use client";

import Modal from "@/components/Modal";
import { useContext, useState } from "react";
import SceneContext from "@/contexts/SceneContext";
import Loading from "../loading";
import CreateScene from "../../CreateScene";

export default function SceneSidebar() {
  const [editSceneMeta, setEditSceneMeta] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const scene = useContext(SceneContext);

  if (!scene) return <Loading />;

  return (
    <>
      <Modal
        opened={editSceneMeta}
        onClose={() => setEditSceneMeta(false)}
        title={`Edit ${scene.name}`}
      >
        <CreateScene onDone={() => setEditSceneMeta(false)} />
      </Modal>
      <div className="sidebar">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-brand-500 text-lg font-bold">{scene.name}</h2>
          <button
            className="primary-button !border-0"
            onClick={() => setEditSceneMeta(true)}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>

        {/* {scene === undefined ? (
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
            {Object.entries(scenes)
              .sort(([, a], [, b]) => b.updated_at - a.updated_at)
              .map(([id, scene]) => (
                <li key={"item-" + id}>
                  <SceneCard scene={scene} id={id} />
                </li>
              ))}
          </ul>
        )} */}
      </div>
    </>
  );
}
