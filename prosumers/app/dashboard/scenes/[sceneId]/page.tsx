import { Scene } from "@/types/scene";
import Link from "next/link";

export default async function SceneDetailPage({
  params,
}: {
  params: { sceneId: string };
}) {
  const scene = await fetch(
    `${process.env.API_BASE_URL}/api/scenes/${params.sceneId}`
  )
    .then((res) => res.json())
    .then((data) => data.scene as Scene);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold">
          {scene.name || "Untitled"}
        </h1>
        <div className="flex gap-2">
          <button className="primary-button">
            <i className="fa-regular fa-pen-to-square"></i>Edit
          </button>
          <Link href="/dashboard/scenes" className="danger-button">
            <i className="fa-regular fa-trash-can"></i> Delete
          </Link>
        </div>
      </div>
      <span className="text-zinc-400 text-sm">
        {scene.description || "No desription"}
      </span>
    </>
  );
}
