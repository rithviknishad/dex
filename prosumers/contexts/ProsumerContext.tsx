"use client";

import { ProsumerModel } from "@/types/scene";
import { createContext } from "react";

const ProsumerContext = createContext<ProsumerModel | null>(null);

export default ProsumerContext;
