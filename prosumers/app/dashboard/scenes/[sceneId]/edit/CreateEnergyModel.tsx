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

const toastOptions = {
  loading: "Saving...",
  error: "Failed to save",
  success: "Saved",
};

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
      <div className="grid grid-cols-2 gap-4">
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
            <div className="text-brand-500 flex items-center justify-center h-12 w-12 rounded-lg mt-2 border border-zinc-800 bg-zinc-900 text-2xl">
              <i className={form?.icon} />
            </div>
          </div>
        </div>

        <div>
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
            value={form.nominal_power}
            onChange={(e) => setForm("nominal_power", e.target.valueAsNumber)}
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
      </div>
      <div className="flex justify-end">
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

export function CreateEnergySourceModel({
  obj,
  onDone,
}: Props<EnergySourceModel>) {
  const { db } = useContext(FirebaseContext);
  const pathSegments = usePathname().split("/");
  const sceneId = pathSegments[3];

  const [form, setForm] = useFormState<State<EnergySourceModel>>(obj || {});

  const handleSubmit = useMemo(() => {
    const validate = (_: State<EnergySourceModel>) => {
      if (!_.name) return "Name is required";
      if (!_.nominal_power) return "Nominal Power is required";
      if (_.nominal_power <= 0)
        return "Nominal Power should be greater than 0 kW";
      if (!_.type) return "Source type is required";
    };

    return async ({ $ref, ...obj }: typeof form) => {
      const validationError = validate(obj);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const id = $ref || Date.now().toString();

      await toast.promise(
        set(ref(db, `scenes/${sceneId}/energy_models/sources/${id}`), {
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
      <div className="grid grid-cols-2 gap-4">
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
            <div className="text-brand-500 flex items-center justify-center h-12 w-12 rounded-lg mt-2 border border-zinc-800 bg-zinc-900 text-2xl">
              <i className={form?.icon} />
            </div>
          </div>
        </div>

        <div>
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
            value={form.nominal_power}
            onChange={(e) => setForm("nominal_power", e.target.valueAsNumber)}
          />
        </div>

        <div>
          <label htmlFor="type" className="block font-medium text-zinc-200">
            Type
          </label>
          <select
            className="my-input mt-2 w-full"
            required
            name="type"
            id="type"
            value={form.type}
            placeholder="Required"
            onChange={(e) => setForm("type", e.target.value as any)}
          >
            <option>Solar</option>
            <option>Wind</option>
            <option>Geothermal</option>
            <option>Nuclear</option>
            <option>Fossil</option>
          </select>
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
      </div>
      <div className="flex justify-end">
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
