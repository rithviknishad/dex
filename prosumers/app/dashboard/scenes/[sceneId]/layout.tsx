"use client";

import ValueProvider from "@/components/providers/ValueProvider";
import SceneContext from "@/contexts/SceneContext";
import ScenesContext from "@/contexts/ScenesContext";
import { useContext } from "react";
import Loading from "../loading";

export default function SceneLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { sceneId: string };
}) {
  const scenes = useContext(ScenesContext);

  if (!scenes) return <Loading />;

  return (
    <ValueProvider context={SceneContext} value={scenes[params.sceneId]}>
      <div className="flex flex-col h-full w-full px-8 py-6">{children}</div>
    </ValueProvider>
  );
}
