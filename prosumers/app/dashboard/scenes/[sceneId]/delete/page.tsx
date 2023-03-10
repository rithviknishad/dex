"use client";

import FirebaseContext from "@/contexts/FirebaseContext";
import { ref, remove } from "firebase/database";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Loading from "../loading";

export default function DeleteScene({
  params: { sceneId },
}: {
  params: { sceneId: string };
}) {
  const [isDeleting, setIsDeleting] = useState(true);
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    remove(ref(db, `scenes/${sceneId}`)).then(() => setIsDeleting(false));
  }, [sceneId, db]);

  if (isDeleting) {
    return <Loading />;
  }

  redirect("/dashboard/scenes");
}
