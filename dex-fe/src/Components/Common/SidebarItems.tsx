import { Atom, atom } from "jotai";

export interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  countAtom: Atom<string | number>;
}

export const sidebarItems = {
  prosumers: {
    name: "Prosumers",
    href: "/prosumers",
    icon: "fa-solid fa-lightbulb",
    countAtom: atom(""),
  },
  orders: {
    name: "Orders",
    href: "/orders",
    icon: "fa-solid fa-file-invoice",
    countAtom: atom(""),
  },
  trades: {
    name: "Trades",
    href: "/trades",
    icon: "fa-solid fa-arrow-right-arrow-left",
    countAtom: atom(""),
  },
  wallet: {
    name: "Sparks Wallet",
    href: "/wallet",
    icon: "fa-solid fa-bolt",
    countAtom: atom(""),
  },
};
