import { useMemo, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";
import { CustomIdentityRequestWrapperProxy } from "./scheduler.identity";

type EditorProps = {
  nylasClientId: string;
  domain?: string;
  queryParams?: EditorQueryParams;
};

export type EditorQueryParams = {
  configurationId: string;
  requiresSlug: boolean;
};

/**
 *
 * @param nylasClientId
 * @param domain - https://api.us.nylas.com/v3 or https://api.eu.nylas.com/v3
 * @param queryParams - if you want to default the view to a specific config please pass in a configurationId parameter
 *      @param configurationID = if you want to default the view to a specific config please pass in a configurationId parameter
 *      @param requiresSlug - if you want to default to use hosted view
 *
 *
 * @example
 *   If you don't want the user to reauthenticate then you need to use the nylasApiRequest prop with a CustomIdentityRequestWrapper component which requires a user level access token.
 * @returns NylasSchedulerEditor component
 */

export default function NylasSchedulerEditor({
  nylasClientId,
  domain,
  queryParams,
}: EditorProps) {
  const [requiresSlug, setRequiresSlug] = useState(false);

  const props = useMemo(() => {
    if (!queryParams) {
      return undefined;
    }

    setRequiresSlug(queryParams.requiresSlug ?? false);

    return {
      configurationId: queryParams.configurationId,
      requiresSlug: queryParams.requiresSlug ?? false,
    };
  }, []);

  const schedulerPreviewLink = () => {
    return requiresSlug
      ? `https://book.nylas.com/us/${nylasClientId}/{slug}`
      : `${window.location.origin}/scheduler/{config.id}`;
  };

  return (
    <div className=" m-auto flex items-center justify-center h-full">
      <ClientOnly fallback={<FallBack />}>
        {() => {
          return (
            <Scheduler.NylasSchedulerEditor
              eventOverrides={{
                createButtonClick: async (e: unknown) => {
                  console.log("Page created", e);
                },
                editButtonClick: async (e: unknown) => {
                  console.log("Page Edited", e);
                },
                schedulerConfigChanged: async (e) => {
                  console.log("Page changed", e);
                  console.log(e.detail.config.id);
                  //check for e.detail.id if it's present then it's saveChanges otherwise the page hasn't been created yet
                },
                deleteButtonClick: async (e) => {
                  console.log("Page deleted", e);
                },
              }}
              mode="app"
              schedulerPreviewLink={schedulerPreviewLink()}
              nylasSessionsConfig={{
                clientId: nylasClientId, // Replace with your Nylas client ID from the previous
                redirectUri: `${window.location.origin}/editor`,
                domain: domain, // or 'https://api.eu.nylas.com/v3' for EU data center
                hosted: true,
                accessType: "offline",
              }}
              // nylasApiRequest={
              //   new CustomIdentityRequestWrapper({
              //     accessToken:
              //       "{{Access Token}}",
              //     provider: "",
              //     email: "{{GRANT_EMAIL}}",
              //     name: "",
              //     grantId:
              //       "{{GRANT_ID}}",
              //   })
              // }
              defaultSchedulerConfigState={{
                selectedConfiguration: {
                  requires_session_auth: false,
                  scheduler: {
                    // callback URLs to be set in email confirmation messages
                    rescheduling_url: `${window.location.origin}/scheduler/reschedule/:booking_ref`,
                    cancellation_url: `${window.location.origin}/scheduler/cancel/:booking_ref`,
                  },
                },
              }}
              {...props}
            ></Scheduler.NylasSchedulerEditor>
          );
        }}
      </ClientOnly>
    </div>
  );
}
