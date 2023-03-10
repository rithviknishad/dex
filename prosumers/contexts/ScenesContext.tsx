"use client";

import { Scene } from "@/types/scene";
import { Collection } from "@/types/types";
import { createContext } from "react";

const ScenesContext = createContext<Collection<Scene> | null>(null);

export default ScenesContext;
