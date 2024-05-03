import { MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NylasSchedulerEditor from "~/components/scheduler.editor";
import configServer from "~/models/config.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type LoaderData = {
    nylasClientId: string
    domain: string
}

export async function loader() {
    return json({
        nylasClientId: configServer.NYLAS_CLIENT_ID,
        domain:configServer.API_ENDPOINT
  })
}
export default function Scheduler() {
  const {nylasClientId,domain} = useLoaderData<LoaderData>()
    
  return <NylasSchedulerEditor nylasClientId={nylasClientId} domain={domain} />;
}
