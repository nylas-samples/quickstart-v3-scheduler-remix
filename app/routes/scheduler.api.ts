import { ActionFunctionArgs, json } from "@remix-run/node";
import { logger } from "~/logger.server";
import schedulerServer from "~/models/nylas/scheduler.server";

/**
 * Scheduler API Middleware for the Scheduled Editor
 * @param request - Request
 * @returns - JSON
 */

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const [data, status] = await schedulerServer.schedulerMiddleWare(body);
  logger.info({ data, status }, "Scheduler API Middleware Response");
  return json(data, {
    status,
  });
}
