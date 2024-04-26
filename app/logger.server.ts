import type { Logger } from "pino";
import { pino } from "pino";
import pretty from "pino-pretty";
import configServer from "./models/config.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logger: Logger;

declare global {
  // eslint-disable-next-line no-var
  var __logger__: Logger;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (configServer.NODE_ENV === "production") {
  logger = pino(pretty());
} else {
  if (!global.__logger__) {
    global.__logger__ = pino(
      pretty({
        levelKey: "level",
      })
    );
  }
  logger = global.__logger__;
}
export { logger };
