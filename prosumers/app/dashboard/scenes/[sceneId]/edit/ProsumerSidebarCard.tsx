import RelativeTime from "@/components/RelativeTime";
import { ProsumerModel, Scene } from "@/types/scene";
import { Refer, WithRef } from "@/types/types";
import classNames from "@/utils/classNames";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  prosumer: WithRef<ProsumerModel>;
}

export default function ProsumerSidebarCard({ prosumer }: Props) {
  const pathSegments = usePathname().split("/");
  const isActive =
    pathSegments[2] === "scenes" &&
    pathSegments[4] === "edit" &&
    pathSegments[5] === "prosumers" &&
    pathSegments[6] === prosumer.$ref;

  return (
    <Link
      href={`/dashboard/scenes/${pathSegments[3]}/edit/prosumers/${prosumer.$ref}`}
    >
      <div
        className={classNames(
          "group flex flex-col gap-2 p-3 w-full rounded bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 ease-in-out cursor-pointer",
          isActive
            ? "border border-brand-500"
            : "border border-zinc-700 hover:border-brand-500"
        )}
      >
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
          <i className="fa-solid fa-plug fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(prosumer.energy_elements?.sources || {}).length}
          </span>
          <i className="fa-solid fa-lightbulb fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(prosumer.energy_elements?.sinks || {}).length}
          </span>
          <i className="fa-solid fa-car-battery fa-sm ml-4"></i>
          <span className="text-sm ml-1.5">
            {Object.keys(prosumer.energy_elements?.storages || {}).length}
          </span>
        </div>
      </div>
    </Link>
  );
}