import { Redirect, useRoutes } from "raviger";
import PageNotFound from "../PageNotFound";
import SignOut from "./SignOut";
import ProsumersList from "./ProsumersList";
import Sidebar from "../../Components/Common/Sidebar";
import Breadcrumbs from "../../Components/Common/Breadcrumbs";

const routes = {
  "/": () => <Redirect to="/prosumers" />,
  "/prosumers": () => <ProsumersList />,
  "/signout": () => <SignOut />,
};

export default function AppRouter() {
  const route = useRoutes(routes) || <PageNotFound />;

  return <Page>{route}</Page>;
}

const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <div className="relative h-full w-full overflow-y-auto">
        <div className="sticky top-0 left-0 right-0">
          <Breadcrumbs />
          <DevelopmentModeNotice />
        </div>
        {children}
      </div>
    </div>
  );
};

const DevelopmentModeNotice = () => {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <i
            className="fa-solid fa-triangle-exclamation h-5 w-5 text-yellow-400"
            aria-hidden
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            You are using a <strong>development</strong> version of the{" "}
            <strong>DEX API</strong>. Results may be inaccurate. Not for
            production use.{" "}
            <a
              href="http://dex-api:9000/swagger"
              className="font-medium text-yellow-700 underline hover:text-yellow-600"
            >
              Learn more.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
