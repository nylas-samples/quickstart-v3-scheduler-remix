import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import authServer from "~/models/nylas/auth.server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ request }: LoaderFunctionArgs) {
  const authUrl = authServer.generateAuthURL(request);
  return redirect(authUrl);
}

export default null;
