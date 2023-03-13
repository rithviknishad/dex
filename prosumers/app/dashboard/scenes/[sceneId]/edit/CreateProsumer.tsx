import FirebaseContext from "@/contexts/FirebaseContext";
import { ProsumerModel } from "@/types/scene";
import { Refer, WithRef } from "@/types/types";
import parseCoordinates from "@/utils/parseCoordinates";
import useFormState from "@/utils/useFormState";
import { ref, serverTimestamp, set, remove } from "firebase/database";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { toast } from "react-hot-toast";

interface Props {
  obj?: WithRef<ProsumerModel>;
  onDone: (ref: Refer<ProsumerModel>) => void;
}

type State<T> = Partial<WithRef<T>>;

const toastOptions = {
  loading: "Saving...",
  error: "Failed to save",
  success: "Saved",
};

export default function CreateProsumer({ obj, onDone }: Props) {
  const { db } = useContext(FirebaseContext);
  const pathSegments = usePathname().split("/");
  const sceneId = pathSegments[3];

  const [form, setForm] = useFormState<State<ProsumerModel>>(obj || {});

  const handleSubmit = useMemo(() => {
    const validate = (_: State<ProsumerModel>) => {
      if (!_.name) return "Name is required";
      if (!_.location) return "Location is required";
    };

    return async ({ $ref, ...obj }: typeof form) => {
      const validationError = validate(obj);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const id = $ref || Date.now().toString();

      await toast.promise(
        set(ref(db, `scenes/${sceneId}/prosumers/${id}`), {
          created_at: serverTimestamp(),
          ...obj,
          updated_at: serverTimestamp(),
        }),
        toastOptions
      );

      onDone(id);
    };
  }, [sceneId, db, onDone]);

  const handleDelete = useCallback(() => {
    if (!obj) return;
    toast.promise(remove(ref(db, `scenes/${sceneId}/prosumers/${obj.$ref}`)), {
      loading: "Deleting...",
      error: "Failed to delete",
      success: "Deleted",
    });
  }, [obj, db, sceneId]);

  const { latitude, longitude } = parseCoordinates(form.location ?? "0,0");

  return (
    <form className="mt-10">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block font-medium text-zinc-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="my-input mt-2"
            placeholder="Required"
            required
            value={form.name}
            onChange={(e) => setForm("name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="icon" className="block font-medium text-zinc-200">
            Icon
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="icon"
              id="icon"
              className="my-input mt-2"
              placeholder="Font-awesome icon class (optional)"
              required
              value={form.icon}
              onChange={(e) => setForm("icon", e.target.value)}
            />
            <div className="text-brand-500 flex items-center justify-center h-12 w-12 rounded-lg mt-2 border border-zinc-800 bg-zinc-900 text-xl">
              <i className={form?.icon} />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="location__latitude"
            className="block font-medium text-zinc-200"
          >
            Latitude (°N)
          </label>
          <input
            type="number"
            name="location__latitude"
            id="location__latitude"
            className="my-input mt-2"
            placeholder="Between 0°N and 180°N"
            required
            value={latitude}
            onChange={(e) =>
              setForm("location", `${e.target.valueAsNumber},${longitude}`)
            }
          />
        </div>

        <div>
          <label
            htmlFor="location__longitutde"
            className="block font-medium text-zinc-200"
          >
            Longitutde (°E)
          </label>
          <input
            type="number"
            name="location__longitutde"
            id="location__longitutde"
            className="my-input mt-2"
            placeholder="Between 0°E and 360°E"
            required
            value={longitude}
            onChange={(e) =>
              setForm("location", `${latitude},${e.target.valueAsNumber}`)
            }
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block font-medium text-zinc-200"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="my-input w-full mt-2"
            placeholder="Optional"
            value={form.description}
            onChange={(e) => setForm("description", e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="tags" className="block font-medium text-zinc-200">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="my-input mt-2"
            placeholder="Comma seperated labels. (Optional)"
            required
            value={form.tags}
            onChange={(e) => setForm("tags", e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {obj && (
          <button className="danger-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button
          onClick={() => handleSubmit(form)}
          className="primary-button mt-10 place-self-end"
        >
          {obj ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
