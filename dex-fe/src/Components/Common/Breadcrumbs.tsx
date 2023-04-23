import { Link } from "raviger";
import { classNames } from "../../utils/classNames";
import { useAtom } from "jotai";
import { sidebarIsOpenAtom } from "./Sidebar";

export default function Breadcrumbs() {
  const [_, setSidebarOpen] = useAtom(sidebarIsOpenAtom);
  const segments = window.location.pathname.split("/");
  segments.shift();

  const pages = segments.map((segment, index) => {
    const href = segments.slice(0, index + 1).join("/");
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    const current = index === segments.length - 1;
    return { href, name, current };
  });

  return (
    <nav className="flex w-full bg-gray-900 p-4" aria-label="Breadcrumb">
      <div className="md:hidden">
        <button
          className="rounded-lg mr-2 text-gray-300 focus:outline"
          onClick={() => setSidebarOpen(true)}
        >
          <i className="fa-solid fa-bars p-2" />
        </button>
      </div>
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <Link href="/" className="text-gray-600 hover:text-gray-500">
            <div className="relative mx-4">
              <span className="flex absolute h-3 w-3 left-0 -mt-1.5 -mr-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            </div>
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <i
                className="text-gray-600 fa-solid fa-chevron-right"
                aria-hidden="true"
              />
              <Link
                href={"/" + page.href}
                className={classNames(
                  "ml-4 text-sm hover:text-white",
                  page.current ? "font-medium text-gray-300" : "text-gray-400"
                )}
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
