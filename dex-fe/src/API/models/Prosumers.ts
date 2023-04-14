import { ModelPK } from ".";

const OrderStatusChoices = {
  ORDER_REQ_RECEIVED: "ORDER_REQ_RECEIVED",
  VALIDATION_PENDING: "VALIDATION_PENDING",
  VALIDATION_REJECTED: "VALIDATION_REJECTED",
  OPEN_PENDING: "OPEN_PENDING",
  OPEN: "OPEN",
  PARTIAL: "PARTIAL",
  PARTIAL_COMPLETE: "PARTIAL_COMPLETE",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
};

export interface Prosumer {
  billing_account: ModelPK;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface BuyOrder extends OrderBase {
  category: BuyCategory;
}

export interface SellOrder extends OrderBase {
  price: number;
  category: SellCategory;
}

interface OrderBase {
  prosumer: ModelPK;
  energy: number;
  status: keyof typeof OrderStatusChoices;
}

type BuyCategory =
  | "DOMESTIC"
  | "MUNICIPAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "AGRICULTURAL"
  | "STORAGE";

type SellCategory =
  | "SOLAR"
  | "WIND"
  | "HYDRO"
  | "GEOTHERMAL"
  | "NUCLEAR"
  | "BIOMASS"
  | "STORAGE";
