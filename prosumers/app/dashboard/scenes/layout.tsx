import ScenesSidebar from "./ScenesSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-full w-full">
      <ScenesSidebar />
      {children}
    </div>
  );
}
