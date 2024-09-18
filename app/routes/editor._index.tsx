import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NylasSchedulerEditor, {
  AccessType,
  EditorQueryParams,
} from "~/components/scheduler.editor";
import configServer from "~/models/config.server";
import { parseQueryParams } from "~/models/utils/utils.server";
import { getSessionValues, SessionData } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Nylas v3 Scheduler" },
    { name: "description", content: "V3 Scheduler" },
  ];
};

type LoaderData = {
  nylasClientId: string;
  domain: string;
  editorQueryParams: EditorQueryParams;
  userCreds?: SessionData;
  origin: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const editorQueryParams = parseQueryParams<EditorQueryParams>(
    url.searchParams,
    ["configurationId", "requiresSlug", "accessType", "email", "grantId"]
  );
  let userCreds: LoaderData["userCreds"] = undefined;
  if (editorQueryParams.accessType === AccessType.ACCESS_TOKEN) {
    const session = await getSessionValues(request);

    if (!session.accessToken) {
      return redirect("/auth");
    }
    userCreds = session;
  }

  if (editorQueryParams.accessType === AccessType.NONE) {
    if (!editorQueryParams.email || !editorQueryParams.grantId) {
      return redirect("/grants");
    }
    userCreds = {
      email: editorQueryParams.email,
      grantId: editorQueryParams.grantId,
    } as SessionData;
  }

  return json({
    nylasClientId: configServer.NYLAS_CLIENT_ID,
    domain: configServer.API_ENDPOINT,
    origin: url.origin,
    editorQueryParams,
    userCreds,
  });
}
export default function Scheduler() {
  const { nylasClientId, domain, editorQueryParams, userCreds, origin } =
    useLoaderData<LoaderData>();

  return (
    <NylasSchedulerEditor
      nylasClientId={nylasClientId}
      domain={domain}
      queryParams={editorQueryParams}
      userCreds={userCreds}
      origin={origin}
    />
  );
}
