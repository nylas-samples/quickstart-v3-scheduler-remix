/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "~/logger.server";
import { ApiService, AuthTypes } from "../api.server";
import configServer from "../config.server";
import { transformToSnakeCase } from "../utils/utils.server";

type SessionRequest = {
  configurationId: string;
  ttl: number;
};

type SessionResponse = {
  session_id: string;
};

const API_ENDPOINT = `${configServer.API_ENDPOINT}/scheduling/sessions`;

const schedulerMiddleWare = async (args: any): Promise<[any, number]> => {
  try {
    logger.info({ args }, "Scheduler proxy request");
    const response = await fetch(
      `${configServer.API_ENDPOINT}/grants/${args.grantId}/${args.path}`,
      {
        method: args.method,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${configServer.NYLAS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.payload),
      }
    );

    // Check if the response is not okay (e.g., 404, 500)
    const data = await response.json();
    if (!response.ok) {
      logger.error(
        { data },
        `Error: ${response.status} ${response.statusText}`
      );
      return [
        {
          error: `Error: ${response.status} ${response.statusText}`,
        },
        response.status,
      ] as any;
    }
    return [data, response.status] as any;
  } catch (error) {
    logger.error("Fetch error:", error);
    return [{ error: "Error" }, 500] as any;
  }
};

const createSchedulerSession = async (sessionPayload: SessionRequest) => {
  const body = transformToSnakeCase(sessionPayload) as BodyInit;

  try {
    const { data } = await ApiService.create<SessionResponse>({
      url: API_ENDPOINT,
      config: {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
      authType: AuthTypes.API_KEY,
    });

    return data.session_id;
  } catch (error) {
    logger.error("Error creating sessions", error);
  }
  return null;
};

const deleteSession = async (sessionId: string) => {
  try {
    await ApiService.create({
      url: `API_ENDPOINT/${sessionId}`,
      config: {},
      authType: AuthTypes.API_KEY,
    });

    return true;
  } catch (error) {
    logger.error("Error deleting sessions", error);
  }

  return false;
};

export default {
  createSchedulerSession,
  deleteSession,
  schedulerMiddleWare,
};
