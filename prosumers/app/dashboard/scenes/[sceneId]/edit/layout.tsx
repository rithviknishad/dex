"use client";

import ValueProvider from "@/components/providers/ValueProvider";
import ProsumerContext from "@/contexts/ProsumerContext";
import SceneContext from "@/contexts/SceneContext";
import { ProsumerModel } from "@/types/scene";
import { Refer } from "@/types/types";
import { useContext, useState } from "react";
import SceneSidebar from "./Sidebar";

export default function EditSceneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scene = useContext(SceneContext);
  const [prosumerRef, setProsumerRef] = useState<Refer<ProsumerModel>>();

  const prosumer =
    scene?.prosumers && prosumerRef
      ? { ...scene.prosumers[prosumerRef], $ref: prosumerRef }
      : null;

  return (
    <div className="flex flex-row h-full w-full">
      <ValueProvider context={ProsumerContext} value={prosumer}>
        <SceneSidebar onProsumerSelect={setProsumerRef} />
        <div className="h-full w-full">{children}</div>
      </ValueProvider>
    </div>
  );
}
