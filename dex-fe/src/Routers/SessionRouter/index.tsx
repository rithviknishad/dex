import { Redirect, useRoutes } from "raviger";
import PageNotFound from "../PageNotFound";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const routes = {
  "/": () => <Redirect to="/auth" />,
  "/auth": () => <SignIn />,
  "/auth/onboard": () => <SignUp />,
  //   "/session-expired": () => <SessionExpired />,
};

export default function SessionRouter() {
  return useRoutes(routes) || <PageNotFound />;
}
