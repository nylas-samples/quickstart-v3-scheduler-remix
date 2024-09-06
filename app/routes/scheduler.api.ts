import { ActionFunctionArgs, json } from "@remix-run/node";
import schedulerServer from "~/models/nylas/scheduler.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();

  const schedulerAPIResponse = await schedulerServer.schedulerMiddleWare(body);
  return json(schedulerAPIResponse);
}
