import { ModelPK } from ".";

export interface Prosumer {
  billing_account: ModelPK;
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Order {
  prosumer: ModelPK | Prosumer;
  energy: number;
  price: number;
  status: OrderStatus;
  category: OrderCategory;
}

type OrderStatus =
  | "ORDER_REQ_RECEIVED"
  | "VALIDATION_PENDING"
  | "VALIDATION_ACCEPTED"
  | "VALIDATION_REJECTED"
  | "OPEN"
  | "PROCESSING"
  | "REJECTED"
  | "COMPLETED";

type OrderCategory =
  | "SOLAR"
  | "WIND"
  | "HYDRO"
  | "GEOTHERMAL"
  | "NUCLEAR"
  | "BIOMASS"
  | "STORAGE"
  | "DOMESTIC"
  | "MUNICIPAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "AGRICULTURAL";

export interface Trade {
  order: ModelPK | Order;
  price: number;
  transmission_losses: number;
  settlement_status: TradeSettlementStatus;
}

type TradeSettlementStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_PROCESSED";
