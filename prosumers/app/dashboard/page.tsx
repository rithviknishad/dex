import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect("/dashboard/scenes");
  return null;
}
