import { Collection, Coordinates, Refer, Schedule, Timestamp } from "./types";

interface BaseModel {
  created_at: Timestamp;
  updated_at: Timestamp;
}

interface EnergyBaseModel extends BaseModel {
  name: string;
  description: string;
  icon: string;
}

export interface EnergySinkModel extends EnergyBaseModel {
  nominal_power: number;
}

export interface EnergySourceModel extends EnergyBaseModel {
  nominal_power: number;
  type: "Solar" | "Wind" | "Hydro" | "Geothermal" | "Nuclear" | "Fossil";
}

export interface EnergyStorageModel extends EnergyBaseModel {
  type: "Lithium Ion" | "Lead Acid" | "Flywheel";
  capacity: number;
  max_charge_power: number;
  max_discharge_power: number;
  round_trip_efficiency: number;
}

export interface ProsumerEnergyModel<T extends EnergyBaseModel> {
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
