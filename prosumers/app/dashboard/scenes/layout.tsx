"use client";

import StreamProvider from "@/components/providers/StreamProvider";
import FirebaseContext from "@/contexts/FirebaseContext";
import ScenesContext from "@/contexts/ScenesContext";
import { ref } from "firebase/database";
import { useContext } from "react";
import ScenesSidebar from "./ScenesSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { db } = useContext(FirebaseContext);
  return (
    <StreamProvider context={ScenesContext} source={ref(db, "scenes")}>
      <div className="flex flex-row h-full w-full">
        <ScenesSidebar />
        <div className="overflow-auto h-full w-full">{children}</div>
      </div>
    </StreamProvider>
  );
}
