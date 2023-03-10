import FirebaseContext from "@/contexts/FirebaseContext";
import { Scene } from "@/types/scene";
import { ref, serverTimestamp, set } from "firebase/database";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onDone: () => void;
}

export default function CreateScene({ onDone }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { db } = useContext(FirebaseContext);

  const handleCreate = async () => {
    setIsCreating(true);

    const scene: Scene = {
      name,
      description,
      created_at: 0,
      updated_at: 0,
    };

    await toast.promise(
      set(
        ref(db, `scenes/${name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_")}`),
        {
          ...scene,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }
      ),
      {
        loading: `Creating ${name}...`,
        success: `${name} created!`,
        error: `Failed to create ${name}.`,
      }
    );

    setIsCreating(false);
    onDone();
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
