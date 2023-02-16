import { Scene } from "@/types/scene";
import SceneCard from "./SceneSidebarCard";

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
