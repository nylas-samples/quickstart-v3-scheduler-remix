import { ClientOnly } from "remix-utils/client-only";
import { SessionData } from "~/sessions";
import FallBack from "./fallback";
import Scheduler from "./nylas-react.client";
import {
  CustomIdentityRequestWrapperAccessToken,
  CustomIdentityRequestWrapperProxy,
} from "./scheduler.identity";

/**
 * @param nylasClientId - Nylas Client ID
 * @param domain - https://api.us.nylas.com/v3 or https://api.eu.nylas.com/v3
 * @param queryParams - if you want to default the view to a specific config please pass in a configurationId parameter
 * @param userCreds - if you want to default to use Access token flow or No Auth flow
 * @param origin - Origin of the page
 */

type EditorProps = {
  nylasClientId: string;
  domain?: string;
  queryParams?: EditorQueryParams;
  userCreds?: SessionData;
  origin?: string;
};

/**
 * Query Params for EditorQueryParams
 * @param configurationId - if you want to default the view to a specific config please pass in a configurationId parameter
 * @param requiresSlug - if you want to default to use hosted view
 * @param accessType  - if you want to default to use Access token flow or No Auth flow
 * @param email    - email of the user - Used by No Auth Flow
 * @param grantId   - grantId of the user - Used by No Auth Flow
 */

export type EditorQueryParams = {
  configurationId: string;
  requiresSlug: boolean;
  accessType: AccessType;
  email: string;
  grantId: string;
  provider: string;
};

/**
 * AccessType
 * @param STANDARD - Standard Auth flow
 * @param ACCESS_TOKEN - Access Token flow
 * @param NONE - No Auth flow
 */

export enum AccessType {
  STANDARD = "standard",
  ACCESS_TOKEN = "accessToken",
  NONE = "none",
}

/**
 * Generate comments for the NylasSchedulerEditor
 * @param nylasClientId - Nylas Client ID
 * @param domain - https://api.us.nylas.com/v3 or https://api.eu.nylas.com/v3
 * @param queryParams - if you want to default the view to a specific config please pass in a configurationId parameter
 * @param userCreds - if you want to default to use Access token flow or No Auth flow
 * @param origin - Origin of the page
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
        provider: userCreds?.provider as string,
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
                previewButtonClicked: async (event, connector) => {
                  event.preventDefault();
                  console.log("Event", event);
                  console.log("connector", connector);
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
                    confirmation_redirect_url: `${origin}/confirmation`, // used for Hosted scheduling pages
                  },
                },
              }}
              {...props()}
            >
              <div slot="custom-page-style-inputs">
                <Scheduler.InputImageUrl name="company_logo_url" />
                <div className="color-picker-container">
                  <label htmlFor="color">Primary color</label>
                  <Scheduler.InputColorPicker name="color" />
                </div>
              </div>
            </Scheduler.NylasSchedulerEditor>
          );
        }}
      </ClientOnly>
    </div>
  );
}
