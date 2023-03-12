import classNames from "@/utils/classNames";

export default function SidebarCard(props: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={classNames(
        "group flex flex-col gap-2 p-3 w-full rounded bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 ease-in-out cursor-pointer",
        props.isActive
          ? "border border-brand-500"
          : "border border-zinc-700 hover:border-brand-500"
      )}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
