import { ClientOnly } from "remix-utils/client-only";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";

interface CustomEvent<T = unknown> extends Event {
  readonly detail: T;
}

type NylasSchedulingCustomEvent<T> = CustomEvent<T>;

export type SchedulerCustomQueryParams = {
  name: string;
  email: string;
};

type NylasCustomSchedulerProps = {
  configId: string;
  bookingId?: string;
  cancelFlow?: boolean;
  rescheduleFlow?: boolean;
  sessionId?: string;
  queryParams?: SchedulerCustomQueryParams;
};

export default function NylasCustomScheduler({
  configId,
  bookingId = "",
  cancelFlow = false,
  rescheduleFlow = false,
  sessionId,
  queryParams,
}: NylasCustomSchedulerProps) {
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

  const bookingInfo = () => {
    if (cancelFlow || !queryParams) {
      return undefined;
    }

    const { name, email } = queryParams;

    if (email && name) {
      return {
        primaryParticipant: {
          name,
          email,
        },
      };
    }
  };
  return (
    <div className=" m-auto flex items-center justify-center">
      <ClientOnly fallback={<FallBack />}>
        {() => {
          return (
            <Scheduler.NylasScheduling
              bookingInfo={bookingInfo()}
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
