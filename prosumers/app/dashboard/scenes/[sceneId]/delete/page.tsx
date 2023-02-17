"use client";

import useFetch from "@/utils/useFetch";
import { notFound, redirect } from "next/navigation";
import Loading from "../loading";

export default function DeleteScene({
  params,
}: {
  params: { sceneId: string };
}) {
  const { data, loading } = useFetch(`/api/scenes/${params.sceneId}`, {
    method: "DELETE",
  });

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    notFound();
  }

  redirect("/dashboard/scenes");
}
