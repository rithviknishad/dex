import SceneDetailPage from "../page";

export default function EditScenePage({
  params: { sceneId },
}: {
  params: { sceneId: string };
}) {
  return <SceneDetailPage params={{ sceneId }} />;
}
