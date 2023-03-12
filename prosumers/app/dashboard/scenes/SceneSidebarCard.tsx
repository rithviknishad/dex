import SidebarCard from "@/components/SidebarCard";
import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import classNames from "@/utils/classNames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RelativeTime from "../../../components/RelativeTime";

interface Props {
  scene: Scene;
  id: Refer<Scene>;
}

export default function SceneCard({ scene, id }: Props) {
  const pathName = usePathname();
  const isActive = pathName?.startsWith("/dashboard/scenes/" + id);

  return (
    <Link href={"/dashboard/scenes/" + id}>
      <SidebarCard isActive={isActive}>
        <div className="flex w-full items-center justify-between">
          <h3
            id={id}
            className={classNames(
              "text-sm font-semibold group-hover:text-brand-500",
              isActive && "text-brand-500"
            )}
          >
            {scene.name}
          </h3>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
            <span>updated </span>
            <RelativeTime time={new Date(scene.updated_at).toISOString()} />
          </p>
        </div>

        {scene.description && (
          <span className="text-zinc-500 text-sm">{scene.description}</span>
        )}

        <div className="flex items-center justify-start font-medium tracking-wider text-brand-800 group-hover:text-brand-700 transition-all duration-200 ease-in-out">
          <i className="fa-solid fa-industry fa-sm ml-1"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(scene.prosumers || {}).length}
          </span>
          <i className="fa-solid fa-plug fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(scene.energy_models?.sources || {}).length}
          </span>
          <i className="fa-solid fa-lightbulb fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(scene.energy_models?.sinks || {}).length}
          </span>
          <i className="fa-solid fa-car-battery fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(scene.energy_models?.storages || {}).length}
          </span>
        </div>
      </SidebarCard>
    </Link>
  );
}
