"use client";

import ValueProvider from "@/components/providers/ValueProvider";
import FirebaseContext from "@/contexts/FirebaseContext";
import firebaseApp from "@/utils/firebaseApp";
import { getDatabase } from "firebase/database";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <ValueProvider
            context={FirebaseContext}
            value={{
              app: firebaseApp,
              db: getDatabase(firebaseApp),
            }}
          >
            {children}
          </ValueProvider>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
