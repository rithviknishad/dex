"use client";

import Modal from "@/components/Modal";
import { MouseEventHandler, useContext, useMemo, useState } from "react";
import SceneContext from "@/contexts/SceneContext";
import CreateScene from "../../CreateScene";
import { Disclosure, Transition } from "@headlessui/react";
import { redirect } from "next/navigation";
import toDocuments from "@/utils/toDocuments";
import ProsumerSidebarCard from "./ProsumerSidebarCard";
import { DisclosureList, DisclosureTitle } from "@/components/Disclosure";
import {
  CreateEnergySinkModel,
  CreateEnergySourceModel,
  CreateEnergyStorageModel,
} from "./CreateEnergyModel";
import CreateProsumer from "./CreateProsumer";
import EnergyModelSidebarCard from "./EnergyModelSidebarCard";

type ModalOpensFor =
  | null
  | "edit-meta"
  | "add-prosumer"
  | "add-sink"
  | "add-source"
  | "add-storage";

export default function SceneSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalFor, showModalFor] = useState<ModalOpensFor>(null);
  const scene = useContext(SceneContext);

  if (!scene) {
    redirect("/dashboard/scenes");
  }

  const handleOnAddClick = (opensFor: ModalOpensFor) => {
    return (e: any) => {
      e.stopPropagation();
      showModalFor(opensFor);
    };
  };

  const closeModal = () => showModalFor(null);

  const _ = useMemo(() => {
    const searchQueryLC = searchQuery.toLowerCase();
    return (obj: { name: string }) =>
      obj.name.toLowerCase().includes(searchQueryLC);
  }, [searchQuery]);

  const prosumers = toDocuments(scene.prosumers || {}).filter(_);
  const sinks = toDocuments(scene.energy_models?.sinks || {}).filter(_);
  const sources = toDocuments(scene.energy_models?.sources || {}).filter(_);
  const storages = toDocuments(scene.energy_models?.storages || {}).filter(_);

  return (
    <>
      <Modal
        opened={modalFor === "edit-meta"}
        onClose={closeModal}
        title={`Edit ${scene.name}`}
      >
        <CreateScene onDone={closeModal} />
      </Modal>
      <Modal
        opened={modalFor === "add-prosumer"}
        onClose={closeModal}
        title="Prosumer: Create"
        className="!max-w-fit"
      >
        <CreateProsumer onDone={closeModal} />
      </Modal>
      <Modal
        opened={modalFor === "add-sink"}
        onClose={closeModal}
        title="Energy Demand Model: Create"
        className="!max-w-fit"
      >
        <CreateEnergySinkModel onDone={closeModal} />
      </Modal>
      <Modal
        opened={modalFor === "add-source"}
        onClose={closeModal}
        title="Energy Source Model: Create"
        className="!max-w-fit"
      >
        <CreateEnergySourceModel onDone={closeModal} />
      </Modal>
      <Modal
        opened={modalFor === "add-storage"}
        onClose={closeModal}
        title="Energy Storage Model: Create"
        className="!max-w-fit"
      >
        <CreateEnergyStorageModel onDone={closeModal} />
      </Modal>
      <div className="sidebar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-brand-500 text-lg font-bold">{scene.name}</h2>
          <button
            className="primary-button !border-0"
            onClick={() => showModalFor("edit-meta")}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>

        <input
          className="my-input -my-2"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Prosumers"
            length={prosumers.length}
            actions={{ Add: handleOnAddClick("add-prosumer") }}
          />
          <DisclosureList items={prosumers} onEmpty="No prosumers.">
            {(prosumer) => (
              <ProsumerSidebarCard prosumer={prosumer} key={prosumer.$ref} />
            )}
          </DisclosureList>
        </Disclosure>

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Energy Demand Models"
            length={sinks.length}
            actions={{ Add: handleOnAddClick("add-sink") }}
          />
          <DisclosureList items={sinks} onEmpty="No sink models.">
            {(m) => <EnergyModelSidebarCard sink={m} key={m.$ref} />}
          </DisclosureList>
        </Disclosure>

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Energy Source Models"
            length={sources.length}
            actions={{ Add: handleOnAddClick("add-source") }}
          />
          <DisclosureList items={sources} onEmpty="No source models.">
            {(m) => <EnergyModelSidebarCard source={m} key={m.$ref} />}
          </DisclosureList>
        </Disclosure>

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Energy Storage Models"
            length={storages.length}
            actions={{ Add: handleOnAddClick("add-storage") }}
          />
          <DisclosureList items={storages} onEmpty="No storage models.">
            {(m) => <EnergyModelSidebarCard storage={m} key={m.$ref} />}
          </DisclosureList>
        </Disclosure>
      </div>
    </>
  );
}
