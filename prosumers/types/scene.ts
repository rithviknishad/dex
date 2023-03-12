import { Collection, Coordinates, Refer, Schedule, Timestamp } from "./types";

interface BaseModel {
  name: string;
  description: string;
  icon?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface EnergySinkModel extends BaseModel {
  nominal_power: number;
}

export interface EnergySourceModel extends BaseModel {
  nominal_power: number;
  type: "Solar" | "Wind" | "Hydro" | "Geothermal" | "Nuclear" | "Fossil";
}

export interface EnergyStorageModel extends BaseModel {
  type: "Lithium Ion" | "Lead Acid" | "Flywheel";
  capacity: number;
  max_charge_power: number;
  max_discharge_power: number;
  round_trip_efficiency: number;
}

export interface ProsumerEnergyModel<
  T extends EnergySinkModel | EnergySourceModel | EnergyStorageModel
> {
  model: Refer<T>;
  schedules?: Collection<Schedule>;
}

export interface ProsumerModel extends BaseModel {
  name: string;
  description: string;
  location: Coordinates;
  tags: string;

  energy_elements?: {
    sinks?: Collection<ProsumerEnergyModel<EnergySinkModel>>;
    sources?: Collection<ProsumerEnergyModel<EnergySourceModel>>;
    storages?: Collection<ProsumerEnergyModel<EnergyStorageModel>>;
  };
}

export interface Scene extends BaseModel {
  name: string;
  description: string;

  energy_models?: {
    sinks?: Collection<EnergySinkModel>;
    sources?: Collection<EnergySourceModel>;
    storages?: Collection<EnergyStorageModel>;
  };

  prosumers?: Collection<ProsumerModel>;
}
