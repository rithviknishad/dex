import { ModelPK } from ".";
import { BillingAccount } from "./JWTAuth";

export interface Prosumer {
  billing_account: BillingAccount;
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  trades_count: number;
  net_energy_exported: number;
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
  energy: number;
  amount: number;
}

type TradeSettlementStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_PROCESSED";

export interface Summary {
  global_prosumers_count: number;
  user_prosumers_count: number;
  global_orders_count: number;
  user_orders_count: number;
  users_open_orders_count: number;
  global_trades_count: number;
  user_trades_count: number;
  user_unsettled_trades_count: number;
  energy_flow: number;
  user_energy_flow: number;
}
