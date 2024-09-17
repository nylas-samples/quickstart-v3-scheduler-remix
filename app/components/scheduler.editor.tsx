import { ClientOnly } from "remix-utils/client-only";
import { SessionData } from "~/sessions";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";
import {
  CustomIdentityRequestWrapperAccessToken,
  CustomIdentityRequestWrapperProxy,
} from "./scheduler.identity";

type EditorProps = {
  nylasClientId: string;
  domain?: string;
  queryParams?: EditorQueryParams;
  userCreds?: SessionData;
  origin?: string;
};

export type EditorQueryParams = {
  configurationId: string;
  requiresSlug: boolean;
  accessType: AccessType;
  email: string;
  grantId: string;
};

export enum AccessType {
  STANDARD = "standard",
  ACCESS_TOKEN = "accessToken",
  NONE = "none",
}

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
  userCreds,
  origin,
}: EditorProps) {
  const props = () => {
    if (!queryParams) {
      return undefined;
    }

    let nylasApiRequest = undefined;

    /**
     * This will capture the editor Auth mode. When you pass in accessType=AccessType.ACCESS_TOKEN or accessType=AccessType.None it will create a CustomIdentityWrapper
     */

    if (queryParams.accessType === AccessType.ACCESS_TOKEN && userCreds) {
      nylasApiRequest = new CustomIdentityRequestWrapperAccessToken({
        accessToken: userCreds.accessToken,
        email: userCreds?.email as string,
        grantId: userCreds?.grantId as string,
        domain,
      });
    }

    if (queryParams.accessType === AccessType.NONE && userCreds) {
      nylasApiRequest = new CustomIdentityRequestWrapperProxy({
        email: userCreds?.email as string,
        grantId: userCreds?.grantId as string,
        domain: origin,
      });
    }

    return {
      configurationId: queryParams.configurationId,
      requiresSlug: queryParams.requiresSlug || false,
      schedulerPreviewLink: queryParams.requiresSlug
        ? `https://book.nylas.com/us/${nylasClientId}/{slug}`
        : `${origin}/scheduler/{config.id}`,
      ...(nylasApiRequest && { nylasApiRequest }),
    };
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
              nylasSessionsConfig={{
                clientId: nylasClientId, // Replace with your Nylas client ID from the previous
                redirectUri: `${origin}/editor`,
                domain: domain, // or 'https://api.eu.nylas.com/v3' for EU data center
                hosted: true,
                accessType: "offline",
              }}
              defaultSchedulerConfigState={{
                selectedConfiguration: {
                  requires_session_auth: false,
                  scheduler: {
                    // NOTE: Keep this path same for reschedule and cancel flow
                    rescheduling_url: `${origin}/scheduler/reschedule/:booking_ref`,
                    cancellation_url: `${origin}/scheduler/cancel/:booking_ref`,
                  },
                },
              }}
              {...props()}
            ></Scheduler.NylasSchedulerEditor>
          );
        }}
      </ClientOnly>
    </div>
  );
}
