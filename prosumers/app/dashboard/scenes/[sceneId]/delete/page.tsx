import { redirect } from "next/navigation";

export default async function DeleteScene({
  params,
}: {
  params: { sceneId: string };
}) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/scenes/${params.sceneId}`,
    {
      method: "DELETE",
    }
  );

  if (res.status === 200) {
    redirect("/dashboard/scenes");
  }

  return <div>Something went wrong</div>;
}
