import FirebaseContext from "@/contexts/FirebaseContext";
import {
  EnergySinkModel,
  EnergySourceModel,
  EnergyStorageModel,
} from "@/types/scene";
import { Refer, WithRef } from "@/types/types";
import useFormState from "@/utils/useFormState";
import { ref, serverTimestamp, set } from "firebase/database";
import { usePathname } from "next/navigation";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface Props<T> {
  onDone: (id: Refer<T>) => void;
  obj?: WithRef<T>;
}

type State<T> = Partial<WithRef<T>>;

export function CreateEnergySinkModel({ obj, onDone }: Props<EnergySinkModel>) {
  const { db } = useContext(FirebaseContext);
  const pathSegments = usePathname().split("/");
  const sceneId = pathSegments[3];

  const [form, setForm] = useFormState<State<EnergySinkModel>>(obj || {});

  const handleSubmit = useMemo(() => {
    const validate = (_: State<EnergySinkModel>) => {
      if (!_.name) return "Name is required";
      if (!_.nominal_power) return "Nominal Power is required";
      if (_.nominal_power <= 0)
        return "Nominal Power should be greater than 0 kW";
    };

    return async ({ $ref, ...obj }: typeof form) => {
      const validationError = validate(obj);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const id = $ref || Date.now().toString();

      await toast.promise(
        set(ref(db, `scenes/${sceneId}/energy_models/sinks/${id}`), {
          created_at: serverTimestamp(),
          ...obj,
          updated_at: serverTimestamp(),
        }),
        toastOptions
      );

      onDone(id);
    };
  }, [sceneId, db, onDone]);

  return (
    <form className="mt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
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

        <div className="col-span-1">
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
            <i className={"text-white " + obj?.icon} />
          </div>
        </div>

        <div className="col-span-2">
          <label
            htmlFor="nominal_power"
            className="block font-medium text-zinc-200"
          >
            Nominal Power (kW)
          </label>
          <input
            type="text"
            name="nominal_power"
            id="nominal_power"
            className="my-input mt-2"
            placeholder="Required"
            required
            value={form.name}
            onChange={(e) => setForm("nominal_power", e.target.valueAsNumber)}
          />
        </div>
      </div>
      <button
        onClick={() => handleSubmit(form)}
        className="primary-button mt-10 place-self-end"
      >
        {obj ? "Update" : "Create"}
      </button>
    </form>
  );
}

const toastOptions = {
  loading: "Saving...",
  error: "Failed to save",
  success: "Saved",
};
