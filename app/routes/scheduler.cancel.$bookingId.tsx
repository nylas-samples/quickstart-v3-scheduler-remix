import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import NylasCustomScheduler from "~/components/scheduler";
import sessionServer from "~/models/nylas/session.server";
import { convertBookingRef } from "~/models/utils/utils.server";

type LoaderData = {
  configurationId: string;
  sessionId: string;
  bookingId: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const bookingId = params.bookingId;

  if (!bookingId) {
    return redirect("/error");
  }
  const [configurationId] = convertBookingRef(bookingId);

  const sessionId = await sessionServer.createSchedulerSession({
    configurationId,
    ttl: 30,
  });

  return json({
    configurationId,
    bookingId,
    sessionId,
  });
}
export default function Scheduler() {
  const { configurationId, bookingId, sessionId } = useLoaderData<LoaderData>();
  return (
    <NylasCustomScheduler
      configId={configurationId ?? ""}
      bookingId={bookingId}
      sessionId={sessionId}
      cancelFlow={true}
    />
  );
}
