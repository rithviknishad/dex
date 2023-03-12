import Modal from "@/components/Modal";
import RelativeTime from "@/components/RelativeTime";
import SidebarCard from "@/components/SidebarCard";
import {
  EnergySinkModel,
  EnergySourceModel,
  EnergyStorageModel,
} from "@/types/scene";
import { WithRef } from "@/types/types";
import classNames from "@/utils/classNames";
import { useState } from "react";
import {
  CreateEnergySinkModel,
  CreateEnergySourceModel,
  CreateEnergyStorageModel,
} from "./CreateEnergyModel";

export default function EnergyModelSidebarCard({
  sink,
  source,
  storage,
}: {
  sink?: WithRef<EnergySinkModel>;
  source?: WithRef<EnergySourceModel>;
  storage?: WithRef<EnergyStorageModel>;
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const isActive = showEditModal;

  const obj = sink ?? source ?? storage;

  if (!obj) {
    return (
      <SidebarCard>
        <div className="flex items-center justify-center text-red-500">
          No object passed!
        </div>
      </SidebarCard>
    );
  }

  return (
    <>
      <Modal
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`${obj.name}: Edit`}
        className="!max-w-fit"
      >
        {sink && (
          <CreateEnergySinkModel
            obj={sink}
            onDone={() => setShowEditModal(false)}
          />
        )}
        {source && (
          <CreateEnergySourceModel
            obj={source}
            onDone={() => setShowEditModal(false)}
          />
        )}
        {storage && (
          <CreateEnergyStorageModel
            obj={storage}
            onDone={() => setShowEditModal(false)}
          />
        )}
      </Modal>
      <SidebarCard onClick={() => setShowEditModal(true)}>
        <div className="flex w-full items-center justify-between">
          <h3
            className={classNames(
              "text-sm font-semibold group-hover:text-brand-500",
              isActive && "text-brand-500"
            )}
          >
            {obj.name}
          </h3>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
            <span>updated </span>
            <RelativeTime time={new Date(obj.updated_at).toISOString()} />
          </p>
        </div>

        {obj.description && (
          <span className="text-zinc-500 text-sm">{obj.description}</span>
        )}

        {/* <div className="flex items-center justify-start font-medium tracking-wider text-brand-800 group-hover:text-brand-700 transition-all duration-200 ease-in-out">
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
        </div> */}
      </SidebarCard>
    </>
  );
}
