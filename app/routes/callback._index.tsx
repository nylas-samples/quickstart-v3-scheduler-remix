import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import authServer from "~/models/nylas/auth.server";
import { transformToCamelCase } from "~/models/utils/utils.server";
import { commitSession, getSession, setSession } from "~/sessions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/error");
  }
  const response = transformToCamelCase(
    await authServer.codeExchangeRequest({ code, origin: url.origin })
  );

  let session = await getSession();

  session = await setSession(response);

  //set Access token and redirect to editor
  return redirect("/editor?accessType=accessToken", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default null;
