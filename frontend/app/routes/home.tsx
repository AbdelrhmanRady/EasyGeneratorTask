import { redirect } from "react-router";
import { paths } from "~/lib/paths";

export function loader() {
  return redirect(paths.signIn);
}
