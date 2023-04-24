import { Summary } from "../../API/models/DEX";

export interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  summaryCountKey?: string;
}

export const sidebarItems = {
  prosumers: {
    name: "Prosumers",
    href: "/prosumers",
    icon: "fa-solid fa-lightbulb",
    summaryCountKey: "user_prosumers_count",
  },
  orders: {
    name: "Orders",
    href: "/orders",
    icon: "fa-solid fa-file-invoice",
    summaryCountKey: "users_open_orders_count",
  },
  trades: {
    name: "Trades",
    href: "/trades",
    icon: "fa-solid fa-arrow-right-arrow-left",
    summaryCountKey: "user_unsettled_trades_count",
  },
  wallet: {
    name: "Sparks Wallet",
    href: "/wallet",
    icon: "fa-solid fa-bolt",
  },
  developer: {
    name: "Developer Settings",
    href: "/settings/developer",
    icon: "fa-solid fa-code",
  },
};
