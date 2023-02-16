import ScenesSidebar from "@/components/Scene/ScenesSidebar";

export default function ScenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full">
      <ScenesSidebar />
      <div className="p-4 w-full">{children}</div>
    </div>
  );
}
