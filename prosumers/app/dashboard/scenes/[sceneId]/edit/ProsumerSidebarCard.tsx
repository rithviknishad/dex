import RelativeTime from "@/components/RelativeTime";
import SidebarCard from "@/components/SidebarCard";
import ProsumerContext from "@/contexts/ProsumerContext";
import { ProsumerModel, Scene } from "@/types/scene";
import { WithRef } from "@/types/types";
import classNames from "@/utils/classNames";
import { usePathname } from "next/navigation";
import { useContext } from "react";

interface Props {
  prosumer: WithRef<ProsumerModel>;
  onClick?: () => void;
}

export default function ProsumerSidebarCard({ prosumer, onClick }: Props) {
  const isActive = useContext(ProsumerContext)?.$ref === prosumer.$ref;
  const pathSegments = usePathname().split("/");
  const sceneId = pathSegments[3];

  return (
    <SidebarCard isActive={isActive} onClick={onClick}>
      <div className="flex w-full items-center justify-between">
        <h3
          className={classNames(
            "text-sm font-semibold group-hover:text-brand-500",
            isActive && "text-brand-500"
          )}
        >
          {prosumer.name}
        </h3>
        <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
          <span>updated </span>
          <RelativeTime time={new Date(prosumer.updated_at).toISOString()} />
        </p>
      </div>

      {prosumer.description && (
        <span className="text-zinc-500 text-sm">{prosumer.description}</span>
      )}

      <div className="flex items-center justify-start font-medium tracking-wider text-brand-800 group-hover:text-brand-700 transition-all duration-200 ease-in-out">
        <i className="fa-solid fa-plug fa-sm"></i>
        <span className="text-sm ml-1.5">
          {Object.keys(prosumer.elements?.sources || {}).length}
        </span>
        <i className="fa-solid fa-lightbulb fa-sm ml-4"></i>
        <span className="text-sm ml-1.5">
          {Object.keys(prosumer.elements?.sinks || {}).length}
        </span>
        <i className="fa-solid fa-car-battery fa-sm ml-4"></i>
        <span className="text-sm ml-1.5">
          {Object.keys(prosumer.elements?.storages || {}).length}
        </span>
      </div>
    </SidebarCard>
  );
}
