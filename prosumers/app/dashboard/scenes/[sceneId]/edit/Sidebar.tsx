"use client";

import Modal from "@/components/Modal";
import { useContext, useState } from "react";
import SceneContext from "@/contexts/SceneContext";
import Loading from "../loading";
import CreateScene from "../../CreateScene";
import { Disclosure, Transition } from "@headlessui/react";

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

  if (!scene) return <Loading />;

  return (
    <>
      <Modal
        opened={modalFor === "edit-meta"}
        onClose={() => showModalFor(null)}
        title={`Edit ${scene.name}`}
      >
        <CreateScene onDone={() => showModalFor(null)} />
      </Modal>
      <Modal
        opened={modalFor === "add-prosumer"}
        onClose={() => showModalFor(null)}
        title="Prosumer: Create"
      >
        {/* <CreateScene onDone={() => showModalFor(null)} /> */}
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
          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring focus-visible:ring-zinc-500 focus-visible:ring-opacity-75">
            <div>
              Prosumers
              <span className="ml-2 tracking-widest text-zinc-400">
                ({Object.keys(scene.prosumers || {}).length})
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="primary-button !border-0 !text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  showModalFor("add-prosumer");
                }}
              >
                Add
              </button>
              <i className="fa-solid fa-chevron-down ui-open:rotate-180 ui-open:transform transition-transform duration-200 ease-in-out"></i>
            </div>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform -translate-y-2 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-2 opacity-0"
          >
            <Disclosure.Panel className="px-2 text-sm text-gray-500">
              If you're unhappy with your purchase for any reason, email us
              within 90 days and we'll refund you in full, no questions asked.
            </Disclosure.Panel>
          </Transition>
        </Disclosure>

        {/* {scene === undefined ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={"item-" + i}
                className="flex w-full h-12 bg-zinc-800 animate-pulse"
              />
            ))}
          </ul>
        ) : Object.keys(scenes).length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <span className="text-lg md:text-xl text-zinc-600 font-medium">
              No scenes
            </span>
            <span className="text-sm md:text-base text-zinc-500 font-medium">
              Create a scene to get started
            </span>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {Object.entries(scenes)
              .sort(([, a], [, b]) => b.updated_at - a.updated_at)
              .map(([id, scene]) => (
                <li key={"item-" + id}>
                  <SceneCard scene={scene} id={id} />
                </li>
              ))}
          </ul>
        )} */}
      </div>
    </>
  );
}
