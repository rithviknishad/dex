import { ScenesManager } from "@/utils/mongoAdapters";
import { redirect } from "next/navigation";

export default async function DeleteScene({
  params,
}: {
  params: { sceneId: string };
}) {
  if (await ScenesManager.delete(params.sceneId)) {
    redirect("/dashboard/scenes");
  }

  return <div>Something went wrong</div>;
}
