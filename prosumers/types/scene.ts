import { Collection, Coordinates, Refer, Schedule } from "./types";

interface BaseModel {
  created_at: string;
  updated_at: string;
}

interface EnergyBaseModel extends BaseModel {
  name: string;
  description: string;
  icon: string;
}

export interface EnergySinkModel extends EnergyBaseModel {
  base_power: number;
}

export interface EnergySourceModel extends EnergyBaseModel {
  base_power: number;
  type: "Solar" | "Wind" | "Hydro" | "Geothermal" | "Nuclear" | "Fossil";
}

export interface EnergyStoreModel extends EnergyBaseModel {
  type: "Lithium Ion" | "Lead Acid" | "Flywheel";
  capacity: number;
  max_charge_rate: number;
  max_discharge_rate: number;
  round_trip_efficiency: number;
}

export interface ProsumerEnergyModel<T extends EnergyBaseModel> {
  model_ref: Refer<T>;
  schedules: (Schedule & { concurrency?: number })[];
}

export interface ProsumerModel extends BaseModel {
  name: string;
  description: string;
  location: Coordinates;
  tags: string[];

  energy_sinks: ProsumerEnergyModel<EnergySinkModel>[];
  energy_sources: ProsumerEnergyModel<EnergySourceModel>[];
  energy_stores: ProsumerEnergyModel<EnergyStoreModel>[];
}

export interface Scene extends BaseModel {
  id: number;
  name: string;
  description: string;

  models: {
    energy_sinks: Collection<EnergySinkModel>;
    energy_sources: Collection<EnergySourceModel>;
    energy_stores: Collection<EnergyStoreModel>;
  };

  prosumers: Collection<ProsumerModel>;
}
