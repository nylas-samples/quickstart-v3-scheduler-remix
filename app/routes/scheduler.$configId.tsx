import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NylasCustomScheduler from "~/components/scheduler";
import sessionServer from "~/models/nylas/session.server";

type LoaderData = {
  configurationId: string;
  sessionId: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const configurationId = params.configId

  if (!configurationId) {
    return redirect("/error")
  }

  const sessionId = await sessionServer.createSchedulerSession({
    configurationId,
    ttl:30
  })
  return json({
    configurationId,
    sessionId
  })
}
export default function Scheduler() {
  const {configurationId,sessionId} = useLoaderData<LoaderData>();
  return (
    <NylasCustomScheduler
      configId={configurationId ?? ""}
      sessionId ={sessionId}
    />
  )
}
