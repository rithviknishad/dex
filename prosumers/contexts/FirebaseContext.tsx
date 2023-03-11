"use client";

import firebaseApp from "@/utils/firebaseApp";
import { FirebaseApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { createContext } from "react";

const FirebaseContext = createContext<{
  db: Database;
  app: FirebaseApp;
}>({
  app: firebaseApp,
  db: getDatabase(firebaseApp),
});

export default FirebaseContext;
