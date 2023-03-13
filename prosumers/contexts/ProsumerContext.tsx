"use client";

import { ProsumerModel } from "@/types/scene";
import { WithRef } from "@/types/types";
import { createContext } from "react";

const ProsumerContext = createContext<WithRef<ProsumerModel> | null>(null);

export default ProsumerContext;
