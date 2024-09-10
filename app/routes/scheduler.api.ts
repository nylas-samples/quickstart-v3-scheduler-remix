import { ActionFunctionArgs, json } from "@remix-run/node";
import schedulerServer from "~/models/nylas/scheduler.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const [data, status] = await schedulerServer.schedulerMiddleWare(body);
  return json(data, {
    status,
  });
}
