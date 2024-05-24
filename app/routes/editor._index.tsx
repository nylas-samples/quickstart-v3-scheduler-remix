import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NylasSchedulerEditor, {
  EditorQueryParams,
} from "~/components/scheduler.editor";
import configServer from "~/models/config.server";
import { parseQueryParams } from "~/models/utils/utils.server";

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
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const editorQueryParams = parseQueryParams<EditorQueryParams>(
    url.searchParams,
    ["configurationId"]
  );
  return json({
    nylasClientId: configServer.NYLAS_CLIENT_ID,
    domain: configServer.API_ENDPOINT,
    editorQueryParams,
  });
}
export default function Scheduler() {
  const { nylasClientId, domain, editorQueryParams } =
    useLoaderData<LoaderData>();

  return (
    <NylasSchedulerEditor
      nylasClientId={nylasClientId}
      domain={domain}
      queryParams={editorQueryParams}
    />
  );
}
