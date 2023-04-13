import { Redirect, useRoutes } from "raviger";
import PageNotFound from "../PageNotFound";
import SignOut from "./SignOut";

const routes = {
  "/": () => <Redirect to="/prosumers" />,
  "/auth/signout": () => <SignOut />,
};

export default function AppRouter() {
  return useRoutes(routes) || <PageNotFound />;
}
