import { Scene } from "@/types/scene";
import { Collection, Refer } from "@/types/types";
import ScenesSidebar from "./ScenesSidebar";

export default function NoSceneSelectedPage() {
  return (
    <div className="p-4 w-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="text-lg md:text-xl text-zinc-600 font-med">
          No scene selected
        </span>
      </div>
    </div>
  );
}
