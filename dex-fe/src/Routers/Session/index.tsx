import { Redirect, useRoutes } from "raviger";
import PageNotFound from "../PageNotFound";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const routes = {
  "/": () => <SignIn />,
  "/onboard": () => <SignUp />,
  //   "/session-expired": () => <SessionExpired />,
};

export default function SessionRouter() {
  return useRoutes(routes) || <PageNotFound />;
}
