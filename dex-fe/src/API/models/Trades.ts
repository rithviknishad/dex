import { ModelPK } from ".";

export interface Trade {
  buy: ModelPK;
  sell: ModelPK;
  price: number;
  trade_distance: number;
  transmission_losses: number;
  total_energy: number;
  cashflow_status:
    | "PAYMENT_PENDING"
    | "PAYMENT_RECEIVED"
    | "DISBURSEMENT_COMPLETE";
}
