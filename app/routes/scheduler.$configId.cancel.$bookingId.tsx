import { useParams } from "@remix-run/react";
import NylasCustomScheduler from "~/components/scheduler";

export async function loader() {
  return null;
}
export default function Scheduler() {
  const params = useParams();
  return (
    <NylasCustomScheduler
      configId={params.configId ?? ""}
      bookingId={params.bookingId}
      cancelFlow={true}
    />
  );
}
