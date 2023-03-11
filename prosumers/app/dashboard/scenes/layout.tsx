"use client";

import StreamProvider from "@/components/providers/StreamProvider";
import FirebaseContext from "@/contexts/FirebaseContext";
import ScenesContext from "@/contexts/ScenesContext";
import { ref } from "firebase/database";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import ScenesSidebar from "./ScenesSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { db } = useContext(FirebaseContext);

  const pathSegments = usePathname().split("/");
  const showSidebar = !(
    pathSegments[2] === "scenes" && pathSegments[4] === "edit"
  );

  return (
    <StreamProvider context={ScenesContext} source={ref(db, "scenes")}>
      <div className="flex flex-row h-full w-full">
        {showSidebar && <ScenesSidebar />}
        <div className="overflow-auto h-full w-full">{children}</div>
      </div>
    </StreamProvider>
  );
}
