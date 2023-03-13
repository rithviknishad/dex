import FirebaseContext from "@/contexts/FirebaseContext";
import {
  EnergySinkModel,
  EnergySourceModel,
  EnergyStorageModel,
} from "@/types/scene";
import { Refer, WithRef } from "@/types/types";
import useFormState from "@/utils/useFormState";
import { ref, serverTimestamp, set, remove } from "firebase/database";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
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
        return "Nominal Power must be greater than 0 kW";
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

  const handleDelete = useCallback(() => {
    if (!obj) return;
    toast.promise(
      remove(ref(db, `scenes/${sceneId}/energy_models/sinks/${obj.$ref}`)),
      {
        loading: "Deleting...",
        error: "Failed to delete",
        success: "Deleted",
      }
    );
  }, [obj, db, sceneId]);

  return (
    <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
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
            htmlFor="nominal_power"
            className="block font-medium text-zinc-200"
          >
            Nominal Power (kW)
          </label>
          <input
            type="number"
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
      <div className="flex gap-2 justify-end mt-10">
        {obj && (
          <button className="danger-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button onClick={() => handleSubmit(form)} className="primary-button">
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
        return "Nominal Power must be greater than 0 kW";
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

  const handleDelete = useCallback(() => {
    if (!obj) return;
    toast.promise(
      remove(ref(db, `scenes/${sceneId}/energy_models/sources/${obj.$ref}`)),
      {
        loading: "Deleting...",
        error: "Failed to delete",
        success: "Deleted",
      }
    );
  }, [obj, db, sceneId]);

  return (
    <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
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
            htmlFor="nominal_power"
            className="block font-medium text-zinc-200"
          >
            Nominal Power (kW)
          </label>
          <input
            type="number"
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
            <option value="">Select</option>
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
      <div className="flex gap-2 justify-end mt-10">
        {obj && (
          <button className="danger-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button onClick={() => handleSubmit(form)} className="primary-button">
          {obj ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

export function CreateEnergyStorageModel({
  obj,
  onDone,
}: Props<EnergyStorageModel>) {
  const { db } = useContext(FirebaseContext);
  const pathSegments = usePathname().split("/");
  const sceneId = pathSegments[3];

  const [form, setForm] = useFormState<State<EnergyStorageModel>>(obj || {});

  const handleSubmit = useMemo(() => {
    const validate = (_: State<EnergyStorageModel>) => {
      if (!_.name) return "Name is required";
      if (!_.capacity) return "Capacity is required";
      if (_.capacity <= 0) return "Capacity must be greater than 0 kWh";
      if (!_.type) return "Storage type is required";
      if (!_.max_charge_power) return "Max. charge power is required";
      if (_.max_charge_power <= 0)
        return "Max. charge power must be greater than 0 kW";
      if (!_.max_discharge_power) return "Max. discharge power is required";
      if (_.max_discharge_power <= 0)
        return "Max. discharge power must be greater than 0 kW";
      if (!_.round_trip_efficiency) return "Round-trip efficiency is required.";
      if (!(0 < _.round_trip_efficiency && _.round_trip_efficiency <= 1))
        return "Must follow: 0.00 < round_trip_efficiency < 100.00";
    };

    return async ({ $ref, ...obj }: typeof form) => {
      const validationError = validate(obj);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const id = $ref || Date.now().toString();

      await toast.promise(
        set(ref(db, `scenes/${sceneId}/energy_models/storages/${id}`), {
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
    toast.promise(
      remove(ref(db, `scenes/${sceneId}/energy_models/storages/${obj.$ref}`)),
      {
        loading: "Deleting...",
        error: "Failed to delete",
        success: "Deleted",
      }
    );
  }, [obj, db, sceneId]);

  return (
    <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
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
              value={form.icon}
              onChange={(e) => setForm("icon", e.target.value)}
            />
            <div className="text-brand-500 flex items-center justify-center h-12 w-12 rounded-lg mt-2 border border-zinc-800 bg-zinc-900 text-xl">
              <i className={form?.icon} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="capacity" className="block font-medium text-zinc-200">
            Capacity (kWh)
          </label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            className="my-input mt-2"
            placeholder="Required"
            required
            value={form.capacity}
            onChange={(e) => setForm("capacity", e.target.valueAsNumber)}
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
            <option value="">Select</option>
            <option>Lithium Ion</option>
            <option>Lead Acid</option>
            <option>Flywheel</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="max_charge_power"
            className="block font-medium text-zinc-200"
          >
            Max. Charge Power (kW)
          </label>
          <input
            type="number"
            name="max_charge_power"
            id="max_charge_power"
            className="my-input mt-2"
            placeholder="Required"
            required
            value={form.max_charge_power}
            onChange={(e) =>
              setForm("max_charge_power", e.target.valueAsNumber)
            }
          />
        </div>

        <div>
          <label
            htmlFor="max_discharge_power"
            className="block font-medium text-zinc-200"
          >
            Max. Discharge Power (kW)
          </label>
          <input
            type="number"
            name="max_discharge_power"
            id="max_discharge_power"
            className="my-input mt-2"
            placeholder="Required"
            required
            value={form.max_discharge_power}
            onChange={(e) =>
              setForm("max_discharge_power", e.target.valueAsNumber)
            }
          />
        </div>

        <div>
          <label
            htmlFor="round_trip_efficiency"
            className="block font-medium text-zinc-200"
          >
            Round-trip Efficiency (%)
          </label>
          <input
            type="number"
            name="round_trip_efficiency"
            id="round_trip_efficiency"
            className="my-input mt-2"
            placeholder="Required. 0 < value < 100"
            required
            value={(form.round_trip_efficiency ?? 0) * 1e2}
            min={0}
            max={100}
            onChange={(e) =>
              setForm("round_trip_efficiency", e.target.valueAsNumber * 1e-2)
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
      </div>
      <div className="flex gap-2 justify-end mt-10">
        {obj && (
          <button className="danger-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button onClick={() => handleSubmit(form)} className="primary-button">
          {obj ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
