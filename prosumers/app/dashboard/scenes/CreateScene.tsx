import { Scene } from "@/types/scene";
import { useState } from "react";

interface Props {
  onCreate: () => void;
}

export default function CreateScene({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);

    const scene: Scene = {
      name,
      description,
      created_at: "",
      updated_at: "",
      models: {
        energy_sinks: {},
        energy_sources: {},
        energy_storages: {},
      },
      prosumers: {},
    };

    const res = await fetch("/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scene),
    });

    console.log(res);

    setIsCreating(false);
    onCreate();
  };

  return (
    <div className="flex flex-col mt-10">
      <label htmlFor="name" className="block font-medium text-zinc-200">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="my-input mt-2"
        placeholder="e.g. Maldives Test Scene"
        value={name}
        disabled={isCreating}
        onChange={(e) => setName(e.target.value)}
      />
      <label
        htmlFor="description"
        className="block text-sm font-medium text-zinc-200 mt-8"
      >
        Description
      </label>
      <textarea
        name="description"
        id="description"
        className="my-input mt-2"
        placeholder="e.g. A test scene for the Maldives"
        value={description}
        disabled={isCreating}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="primary-button mt-10 place-self-end"
      >
        Create
      </button>
    </div>
  );
}
