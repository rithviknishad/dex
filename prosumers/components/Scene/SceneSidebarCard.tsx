"use client";

import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import classNames from "@/utils/classNames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RelativeTime from "../RelativeTime";

interface Props {
  scene: Scene;
  id: Refer<Scene>;
}

export default function SceneCard({ scene, id }: Props) {
  const pathName = usePathname();

  const isActive = pathName?.startsWith("/dashboard/scenes/" + id);

  return (
    <Link href={"/dashboard/scenes/" + id}>
      <div className="group flex flex-col p-3 w-full rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-brand-500 transition-all duration-200 ease-in-out cursor-pointer">
        <div className="flex w-full items-center justify-between">
          <h3
            className={classNames(
              "text-sm font-semibold group-hover:text-brand-500",
              isActive && "text-brand-500 shadow-2xl shadow-brand-500"
            )}
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
