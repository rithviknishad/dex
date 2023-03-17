"use client";

import ProsumerContext from "@/contexts/ProsumerContext";
import { useContext, useState } from "react";
import SceneDetailPage from "../page";
import { ref, remove } from "firebase/database";
import FirebaseContext from "@/contexts/FirebaseContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import CreateProsumer from "./CreateProsumer";
import parseCoordinates from "@/utils/parseCoordinates";
import RelativeTime from "@/components/RelativeTime";

export default function EditScenePage({
  params: { sceneId },
}: {
  params: { sceneId: string };
}) {
  const { db } = useContext(FirebaseContext);
  const prosumer = useContext(ProsumerContext);
  const [editProsumer, setEditProsumer] = useState(false);
  const { refresh } = useRouter();

  if (!prosumer) {
    return <SceneDetailPage params={{ sceneId }} />;
  }

  const location = parseCoordinates(prosumer.location);

  return (
    <div className="px-8 py-6">
      <Modal
        title={`Edit Prosumer: ${prosumer.name}`}
        className="!max-w-fit"
        opened={editProsumer}
        onClose={() => setEditProsumer(false)}
      >
        <CreateProsumer
          onDone={() => {
            setEditProsumer(false);
            refresh();
          }}
          obj={prosumer}
        />
      </Modal>
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-brand-500/80">
          Prosumer: {prosumer.name || "Untitled"}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mr-4">
            <span>updated </span>
            <RelativeTime time={new Date(prosumer.updated_at).toISOString()} />
          </p>
          <button
            className="primary-button"
            onClick={() => setEditProsumer(true)}
          >
            <i className="fa-regular fa-pen-to-square"></i>Edit
          </button>
          <button
            className="danger-button"
            onClick={() => {
              toast.promise(
                remove(
                  ref(db, `scenes/${sceneId}/prosumers/${prosumer.$ref}`)
                ).then(refresh),
                {
                  loading: `Deleting ${prosumer.name}`,
                  success: `Deleted ${prosumer.name}`,
                  error: `Failed to delete ${prosumer.name}`,
                }
              );
            }}
          >
            <i className="fa-regular fa-trash-can"></i> Delete
          </button>
        </div>
      </div>
      <p className="text-zinc-500 text-sm m-1">
        <i className="fa-solid fa-location-dot" />
        <span className="ml-2 tracking-wider">
          {location.latitude.toFixed(4)}° N {location.longitude.toFixed(4)}° E
        </span>
      </p>
    </div>
  );
}
