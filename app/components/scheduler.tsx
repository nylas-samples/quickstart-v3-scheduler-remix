import { useCallback, useMemo } from "react";
import { ClientOnly } from "remix-utils/client-only";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";

interface CustomEvent<T = unknown> extends Event {
  readonly detail: T;
}

type NylasSchedulingCustomEvent<T> = CustomEvent<T>;

/**
 * Type SchedulerCustomQueryParams
 * @param name - Name of the user to prefill the booking form
 * @param email - Email of the user to prefill the booking email
 */

export type SchedulerCustomQueryParams = {
  name: string;
  email: string;
};

/**
 * Type NylasCustomSchedulerProps
 * @param configId - Configuration ID of the scheduler
 * @param bookingId - Booking ID of the scheduler
 * @param cancelFlow - Boolean to check if the flow is cancel flow
 * @param rescheduleFlow - Boolean to check if the flow is reschedule flow
 * @param sessionId - Session ID of the scheduler
 * @param queryParams - Query Params for the scheduler
 * @param domain - Domain of the scheduler
 */
type NylasCustomSchedulerProps = {
  configId: string;
  bookingId?: string;
  cancelFlow?: boolean;
  rescheduleFlow?: boolean;
  sessionId?: string;
  queryParams?: SchedulerCustomQueryParams;
  domain: string;
};

/**
 * NylasCustomScheduler
 * @param configId - Configuration ID of the scheduler
 * @param bookingId - Booking ID of the scheduler
 * @param cancelFlow - Boolean to check if the flow is cancel flow
 * @param rescheduleFlow - Boolean to check if the flow is reschedule flow
 * @param sessionId - Session ID of the scheduler
 * @param queryParams - Query Params for the scheduler
 * @param domain - Domain of the scheduler
 */
export default function NylasCustomScheduler({
  configId,
  bookingId = "",
  cancelFlow = false,
  rescheduleFlow = false,
  sessionId,
  queryParams,
  domain,
}: NylasCustomSchedulerProps) {
  const commonEventHander = async (e: CustomEvent, connector?: unknown) => {
    e.preventDefault();

    console.log("Any event", e);
    console.log("connector", connector);
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

  const bookingInfo = useCallback(() => {
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
  }, [cancelFlow, queryParams]);

  const timeSlotConfirmed = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (e: CustomEvent, connector?: any) => {
      event?.preventDefault();
      console.log("Time slot confirmed");
      if (queryParams?.name && queryParams.email) {
        await connector.scheduler.bookTimeSlot({
          primaryParticipant: {
            name: queryParams.name,
            email: queryParams.email,
          },
        });
      }
    },
    [queryParams]
  );

  const props = useMemo(() => {
    if (sessionId) {
      return {
        sessionId,
        bookingInfo: bookingInfo(),
      };
    }

    return {
      configurationId: configId,
      bookingInfo: bookingInfo(),
    };
  }, [sessionId, bookingInfo, configId]);

  return (
    <div className=" m-auto flex h-full items-center justify-center">
      <ClientOnly fallback={<FallBack />}>
        {() => {
          return (
            <Scheduler.NylasScheduling
              schedulerApiUrl={domain}
              nylasBranding={false}
              onBookingRefExtracted={onBookingRefExtracted}
              eventOverrides={{
                detailsConfirmed: commonEventHander,
                bookingInfo: commonEventHander,
                timeSlotConfirmed: timeSlotConfirmed,
                //bookingFormSubmitted: commonEventHander,
              }}
              onBookedEventInfo={(event: CustomEvent) => {
                console.log(event);
              }}
              {...(cancelFlow && { cancelBookingRef: bookingId })}
              {...(rescheduleFlow && { rescheduleBookingRef: bookingId })}
              {...props}
            ></Scheduler.NylasScheduling>
          );
        }}
      </ClientOnly>
    </div>
  );
}
