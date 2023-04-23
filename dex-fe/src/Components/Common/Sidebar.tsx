import { Link } from "raviger";
import { authProfileAtom } from "../../hooks/useJWTAuth";
import { classNames } from "../../utils/classNames";
import { atom, useAtom } from "jotai";
import { SidebarItem, sidebarItems } from "./SidebarItems";
import SlideOver from "./Slideover";

export const sidebarIsOpenAtom = atom(false);

export default function Sidebar() {
  const [isOpen, setIsOpen] = useAtom(sidebarIsOpenAtom);

  return (
    <>
      <div className="hidden md:flex md:grow">
        <GenericSidebar />
      </div>
      <div className="md:hidden">
        <SlideOver slideFrom="left" onlyChild open={isOpen} setOpen={setIsOpen}>
          <div className="flex grow h-full">
            <GenericSidebar />
          </div>
        </SlideOver>
      </div>
    </>
  );
}

const GenericSidebar = () => {
  const [account] = useAtom(authProfileAtom);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-full md:max-w-xs">
      <div className="flex h-16 shrink-0 items-center">
        <span className="font-display text-2xl text-brand-500 font-bold">
          DEX <span className="text-gray-400 ml-1">Prosumer</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {Object.entries(sidebarItems).map(([key, item]) => (
                <Item key={key} item={item} />
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto mb-8">
            <Link
              href="/signout"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800 transition-colors duration-150"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-800"
                src="https://github.com/rithviknishad.png"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">
                {account?.name || account?.username || "Anonymous"}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Item = ({ item }: { item: SidebarItem }) => {
  const current = window.location.pathname.startsWith(item.href);
  const [count] = useAtom(item.countAtom);
  const [_, setIsOpen] = useAtom(sidebarIsOpenAtom);

  return (
    <li key={item.name}>
      <Link
        href={item.href}
        className={classNames(
          current
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:text-white hover:bg-gray-800",
          "group flex gap-x-3 rounded-md p-4 md:p-2 text-sm leading-6 font-semibold items-center transition-all duration-150"
        )}
        onClick={() => setIsOpen(false)}
      >
        <i className={classNames("mx-2", item.icon)} aria-hidden="true" />
        {item.name}
        {count ? (
          <span
            className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
            aria-hidden="true"
          >
            {count}
          </span>
        ) : null}
      </Link>
    </li>
  );
};
