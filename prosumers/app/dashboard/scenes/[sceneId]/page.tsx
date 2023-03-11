"use client";

import FirebaseContext from "@/contexts/FirebaseContext";
import SceneContext from "@/contexts/SceneContext";
import { ref, remove } from "firebase/database";

import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, useContext } from "react";
import { toast } from "react-hot-toast";

export default function SceneDetailPage({
  params,
}: {
  params: { sceneId: string };
}) {
  const scene = useContext(SceneContext);
  const { db } = useContext(FirebaseContext);

  if (!scene) {
    redirect("/dashboard/scenes");
  }

  const metrics = {
    networkCharacteristics: {
      penetration: 0.5,
      peakPower: "2.9 MW",
      baseDemand: "0.3 MW",
    },
    prosumerMixCharacteristics: {
      prosumers: Object.keys(scene.prosumers || {}).length,
      residential: 5,
      municipal: 5,
      industrial: 5,
      withSolar: 2,
      withStorage: 2,
      withWind: 2,
      external: 2,
    },
    energyModels: {
      soures: Object.keys(scene.energy_models?.sources || {}).length,
      sinks: Object.keys(scene.energy_models?.sinks || {}).length,
      storages: Object.keys(scene.energy_models?.storages || {}).length,
    },
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-brand-500/80">
          {scene.name || "Untitled"}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/scenes/${params.sceneId}/edit`}
            className="primary-button"
          >
            <i className="fa-regular fa-pen-to-square"></i>Edit
          </Link>
          <button
            className="danger-button"
            onClick={() => {
              toast.promise(remove(ref(db, `scenes/${params.sceneId}`)), {
                loading: `Deleting ${scene.name}`,
                success: `Deleted ${scene.name}`,
                error: `Failed to delete ${scene.name}`,
              });
            }}
          >
            <i className="fa-regular fa-trash-can"></i> Delete
          </button>
        </div>
      </div>
      <span className="text-zinc-400 text-sm">
        {scene.description || "No desription"}
      </span>

      <section id="netwok-characteristics" className="py-8 px-2">
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">
          <i className="fa-solid fa-diagram-project mr-3 fa-sm text-zinc-400"></i>
          Network Characteristics
        </h2>
        <div className="flex flex-wrap gap-4">
          <InfoTile
            label="Penetration"
            value={metrics.networkCharacteristics.penetration * 100 + "%"}
            icon="fa-solid fa-down-left-and-up-right-to-center"
          />
          <InfoTile
            label="Peak Power"
            value={metrics.networkCharacteristics.peakPower}
            icon="fa-brands fa-think-peaks"
          />
          <InfoTile
            label="Base Demand"
            value={metrics.networkCharacteristics.baseDemand}
            icon="fa-brands fa-think-peaks animate-pulse !text-brand-500"
          />
        </div>
      </section>

      <section id="prosumer-mix" className="py-8 px-2">
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">
          <i className="fa-solid fa-diagram-project mr-3 fa-sm text-zinc-400"></i>
          Prosumer Mix Characteristics
        </h2>
        <div className="flex flex-wrap gap-4">
          <InfoTile
            label="Total Prosumers"
            value={metrics.prosumerMixCharacteristics.prosumers}
            icon="fa-solid fa-industry"
          />
          <InfoTile
            label="Residential Category"
            value={metrics.prosumerMixCharacteristics.residential}
            icon="fa-solid fa-house"
          />
          <InfoTile
            label="Municipal Category"
            value={metrics.prosumerMixCharacteristics.municipal}
            icon="fa-solid fa-road"
          />
          <InfoTile
            label="Industrial Category"
            value={metrics.prosumerMixCharacteristics.industrial}
            icon="fa-solid fa-industry"
          />
          <InfoTile
            label="Has Solar"
            value={metrics.prosumerMixCharacteristics.withSolar}
            icon="fa-solid fa-solar-panel"
          />
          <InfoTile
            label="Has Storage"
            value={metrics.prosumerMixCharacteristics.withStorage}
            icon="fa-solid fa-car-battery"
          />
          <InfoTile
            label="Has Wind"
            value={metrics.prosumerMixCharacteristics.withWind}
            icon="fa-solid fa-wind"
          />
          <InfoTile
            label="External Prosumers"
            value={metrics.prosumerMixCharacteristics.external}
            icon="fa-solid fa-up-right-from-square"
          />
        </div>
      </section>

      <section id="energy-models" className="py-8 px-2">
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">
          <i className="fa-solid fa-charging-station mr-3 fa-sm text-zinc-400"></i>
          Energy Models
        </h2>
        <div className="flex flex-wrap gap-4">
          <InfoTile
            label="Generation Sources"
            value={metrics.energyModels.soures}
            icon="fa-solid fa-plug"
          />
          <InfoTile
            label="Demand Sinks / Loads"
            value={metrics.energyModels.sinks}
            icon="fa-solid fa-lightbulb"
          />
          <InfoTile
            label="Energy Storages"
            value={metrics.energyModels.storages}
            icon="fa-solid fa-car-battery"
          />
        </div>
      </section>
    </div>
  );
}

interface InfoTileProps {
  label: string;
  value: ReactNode;
  icon?: string;
}

function InfoTile({ label, value, icon }: InfoTileProps) {
  return (
    <div className="px-5 py-3 flex flex-row gap-5 items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 ease-in-out">
      {icon && <i className={`text-zinc-500 fa-xl ${icon}`}></i>}
      <div className="flex flex-col justify-start">
        <span className="text-zinc-400 text-sm font-medium uppercase">
          {label}
        </span>
        <span className="text-zinc-200 text-xl tracking-wider font-bold">
          {value}
        </span>
      </div>
    </div>
  );
}
