"use client";

import ProsumerContext from "@/contexts/ProsumerContext";
import { useContext } from "react";
import SceneDetailPage from "../page";

export default function EditScenePage({
  params: { sceneId },
}: {
  params: { sceneId: string };
}) {
  const prosumer = useContext(ProsumerContext);

  if (!prosumer) {
    return <SceneDetailPage params={{ sceneId }} />;
  }

  return (
    <div>
      <h1>Prosumer: {prosumer.name}</h1>
    </div>
  );
}
