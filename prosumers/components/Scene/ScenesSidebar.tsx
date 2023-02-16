import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import Link from "next/link";
import RelativeTime from "../RelativeTime";

const dummyScene: Scene = {
  name: "Scene 1",
  description: "This is a scene",
  created_at: "2021-09-01T00:00:00.000Z",
  updated_at: "2021-09-01T00:00:00.000Z",
  models: {
    energy_sinks: {},
    energy_sources: {},
    energy_storages: {},
  },
  prosumers: {},
};

export default function ScenesSidebar() {
  return (
    <div className="sidebar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-brand-500 text-lg font-bold">Scenes</h2>
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-brand-500 hover:bg-brand-500 text-brand-500 hover:text-black text-sm font-medium transition-all duration-200 ease-in-out">
          New Scene
        </button>
      </div>

      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
      <SceneCard scene={dummyScene} id="dummy-scene" />
    </div>
  );
}

function SceneCard({ scene, id }: { scene: Scene; id: Refer<Scene> }) {
  return (
    <Link href={"/dashboard/scenes/" + id}>
      <div className="group flex flex-col p-3 w-full rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-brand-500 transition-all duration-200 ease-in-out cursor-pointer">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-sm font-semibold group-hover:text-brand-500">
            {scene.name}
          </h3>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
            <span>updated </span>
            <RelativeTime time={scene.updated_at} />
          </p>
        </div>
      </div>
    </Link>
  );
}
