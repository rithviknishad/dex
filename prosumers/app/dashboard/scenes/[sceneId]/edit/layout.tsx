"use client";

import ValueProvider from "@/components/providers/ValueProvider";
import ProsumerContext from "@/contexts/ProsumerContext";
import { ProsumerModel } from "@/types/scene";
import { WithRef } from "@/types/types";
import { useState } from "react";
import SceneSidebar from "./Sidebar";

export default function EditSceneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prosumer, setProsumer] = useState<WithRef<ProsumerModel> | null>(null);
  return (
    <div className="flex flex-row h-full w-full">
      <ValueProvider context={ProsumerContext} value={prosumer}>
        <SceneSidebar onProsumerSelect={setProsumer} />
        <div className="h-full w-full">{children}</div>
      </ValueProvider>
    </div>
  );
}
