"use client";

import Modal from "@/components/Modal";
import { MouseEventHandler, useContext, useState } from "react";
import SceneContext from "@/contexts/SceneContext";
import CreateScene from "../../CreateScene";
import { Disclosure, Transition } from "@headlessui/react";
import { redirect } from "next/navigation";
import toDocuments from "@/utils/toDocuments";
import ProsumerSidebarCard from "./ProsumerSidebarCard";
import { DisclosureList, DisclosureTitle } from "@/components/Disclosure";
import { CreateEnergySinkModel } from "./CreateEnergyModel";

type ModalOpensFor =
  | null
  | "edit-meta"
  | "add-prosumer"
  | "add-sink"
  | "add-source"
  | "add-storage";

export default function SceneSidebar() {
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

  const prosumers = toDocuments(scene.prosumers || {});
  const sinks = toDocuments(scene.energy_models?.sinks || {});
  const sources = toDocuments(scene.energy_models?.sources || {});
  const storages = toDocuments(scene.energy_models?.storages || {});

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
      >
        {/* <CreateScene onDone={closeModal} /> */}
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
      >
        {/* <CreateScene onDone={closeModal} /> */}
      </Modal>
      <Modal
        opened={modalFor === "add-storage"}
        onClose={closeModal}
        title="Energy Storage Model: Create"
      >
        {/* <CreateScene onDone={closeModal} /> */}
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
          <DisclosureList items={prosumers} onEmpty="No sink models.">
            {(m) => <ProsumerSidebarCard prosumer={m} key={m.$ref} />}
          </DisclosureList>
        </Disclosure>

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Energy Source Models"
            length={sources.length}
            actions={{ Add: handleOnAddClick("add-source") }}
          />
          <DisclosureList items={prosumers} onEmpty="No source models.">
            {(m) => <ProsumerSidebarCard prosumer={m} key={m.$ref} />}
          </DisclosureList>
        </Disclosure>

        <Disclosure defaultOpen>
          <DisclosureTitle
            title="Energy Storage Models"
            length={storages.length}
            actions={{ Add: handleOnAddClick("add-storage") }}
          />
          <DisclosureList items={prosumers} onEmpty="No storage models.">
            {(model) => (
              <ProsumerSidebarCard prosumer={model} key={model.$ref} />
            )}
          </DisclosureList>
        </Disclosure>
      </div>
    </>
  );
}
