import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import Link from "next/link";
import RelativeTime from "../../../components/RelativeTime";

interface Props {
  scene: Scene;
  id: Refer<Scene>;
  onClick?: () => void;
}

export default function SceneCard({ scene, id, onClick }: Props) {
  return (
    <Link href={"/dashboard/scenes#" + id} onClick={onClick}>
      <div className="group flex flex-col p-3 w-full rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-brand-500 transition-all duration-200 ease-in-out cursor-pointer">
        <div className="flex w-full items-center justify-between">
          <h3
            id={id}
            className="text-sm font-semibold group-hover:text-brand-500 target:text-brand-500"
          >
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
