import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NylasCustomScheduler, {
  SchedulerCustomQueryParams,
} from "~/components/scheduler";
import sessionServer from "~/models/nylas/scheduler.server";
import { parseQueryParams } from "~/models/utils/utils.server";

type LoaderData = {
  configurationId: string;
  sessionId: string;
  bookingInfo: SchedulerCustomQueryParams;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const configurationId = params.configId;

  const url = new URL(request.url);

  const bookingInfo = parseQueryParams<SchedulerCustomQueryParams>(
    url.searchParams,
    ["name", "email"]
  );

  if (!configurationId) {
    return redirect("/error");
  }

  const sessionId = await sessionServer.createSchedulerSession({
    configurationId,
    ttl: 30,
  });
  return json({
    configurationId,
    sessionId,
    bookingInfo,
  });
}
export default function Scheduler() {
  const { configurationId, sessionId, bookingInfo } =
    useLoaderData<LoaderData>();
  return (
    <NylasCustomScheduler
      configId={configurationId ?? ""}
      sessionId={sessionId}
      queryParams={bookingInfo}
    />
  );
}
