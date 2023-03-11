import FirebaseContext from "@/contexts/FirebaseContext";
import SceneContext from "@/contexts/SceneContext";
import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import { ref, serverTimestamp, set } from "firebase/database";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onDone: (id: Refer<Scene>) => void;
}

export default function CreateScene({ onDone }: Props) {
  const scene = useContext(SceneContext);
  const pathSegments = usePathname().split("/");
  const sceneId =
    pathSegments[2] === "scenes" && pathSegments[4] === "edit"
      ? pathSegments[3]
      : null;

  const [name, setName] = useState(scene?.name || "");
  const [description, setDescription] = useState(scene?.description || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { db } = useContext(FirebaseContext);

  const validate = () => {
    if (!name) {
      return "Name is required";
    }
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const id = sceneId || name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

    await toast.promise(
      set(ref(db, `scenes/${id}`), {
        created_at: serverTimestamp(),
        ...(scene || {}),
        name,
        description,
        updated_at: serverTimestamp(),
      }),
      {
        loading: (
          <p>
            {scene ? "Updating" : "Creating"} <strong>{name}</strong>...
          </p>
        ),
        success: (
          <p>
            <strong>{name}</strong> {scene ? "updated" : "created"}!
          </p>
        ),
        error: (
          <p>
            Failed to {scene ? "update" : "create"} <strong>{name}</strong>
          </p>
        ),
      }
    );

    setIsSubmitting(false);
    onDone(id);
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
        disabled={isSubmitting}
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
        disabled={isSubmitting}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="primary-button mt-10 place-self-end"
      >
        {scene ? "Update" : "Create"}
      </button>
    </div>
  );
}
