import { ClientOnly } from "remix-utils/client-only";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const THEME = {
  "--nylas-primary": "",
  "--nylas-info": "",
  "--nylas-success": "",
  "--nylas-warning": "",
  "--nylas-error": "",
  "--nylas-error-pressed": "",
  "--nylas-base-0": "#ebdbb0",
  "--nylas-base-25": "#ebdbb0",
  "--nylas-base-50": "#ebdbb0",
  "--nylas-base-100": "#ebdbb0",
  "--nylas-base-200": "#ebdbb0",
  "--nylas-base-300": "#ebdbb0",
  "--nylas-base-400": "#ebdbb0",
  "--nylas-base-500": "#ebdbb0",
  "--nylas-base-600": "#ebdbb0",
  "--nylas-base-700": "#ebdbb0",
  "--nylas-base-800": "#ebdbb0",
  "--nylas-base-900": "#ebdbb0",
  "--nylas-base-950": "#ebdbb0",
  "--nylas-font-family": "",
  "--nylas-font-size": "",
  "--nylas-border-radius": "10px",
  "--nylas-border-radius-2x": "10px",
  "--nylas-border-radius-3x": "10px",
};

interface CustomEvent<T = unknown> extends Event {
  readonly detail: T;
}

type NylasSchedulingCustomEvent<T> = CustomEvent<T>;

export default function NylasCustomScheduler({
  configId,
  bookingId = "",
  cancelFlow = false,
  rescheduleFlow = false,
  sessionId,
}: {
  configId: string;
  bookingId?: string;
  cancelFlow?: boolean;
  rescheduleFlow?: boolean;
  sessionId?: string;
}) {
  const detailsConfirmed = async (e: CustomEvent) => {
    console.log("Booking made", e);
  };

  const commonEventHander = async (e: CustomEvent) => {
    console.log("Any event", e);
  };

  const onBookingRefExtracted = (
    event: NylasSchedulingCustomEvent<{
      configurationId: string;
      bookingId: string;
    }>
  ) => {
    console.log("Config ID", event.detail.configurationId),
      console.log("BookingID", event.detail.bookingId);
  };

  const props = () => {
    if (sessionId) {
      return {
        sessionId,
      };
    }

    return {
      configurationId: configId,
    };
  };
  return (
    <div className=" m-auto flex items-center justify-center">
      <ClientOnly fallback={<FallBack />}>
        {() => {
          return (
            <Scheduler.NylasScheduling
              themeConfig={{
                "--nylas-primary": "#ebdbb0",
                "--nylas-base-900": "#ebdbb0",
              }}
              schedulerApiUrl="https://api.us.nylas.com/v3"
              nylasBranding={false}
              onBookingRefExtracted={onBookingRefExtracted}
              eventOverrides={{
                detailsConfirmed,
                bookingInfo: detailsConfirmed,
                nameChanged: commonEventHander,
                emailChanged: commonEventHander,
              }}
              {...(cancelFlow && { cancelBookingRef: bookingId })}
              {...(rescheduleFlow && { rescheduleBookingRef: bookingId })}
              {...props()}
            />
          );
        }}
      </ClientOnly>
    </div>
  );
}
