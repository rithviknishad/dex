"use client";

import { Scene } from "@/types/scene";
import { createContext } from "react";

const SceneContext = createContext<Scene | null>(null);

export default SceneContext;
