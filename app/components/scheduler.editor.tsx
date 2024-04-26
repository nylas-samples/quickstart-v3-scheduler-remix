
import { ClientOnly } from "remix-utils/client-only";
import Scheduler from "./nylas-react.client";
import FallBack from "./fallback";

interface EditorProps {
  nylasClientId: string;
  domain?: string;
}

export default function NylasSchedulerEditor({nylasClientId,domain}:EditorProps) {
  return (
    <div className=" m-auto flex items-center justify-center">
      <ClientOnly fallback={<FallBack />}>
        {() => {
          return (
            <Scheduler.NylasSchedulerEditor
              eventOverrides={{
                createButtonClick: async (e) => {
                  console.log("Page created", e);
                },
                editButtonClick: async (e) => {
                  console.log("Page Edited", e);
                },
                schedulerConfigChanged: async (e) => {
                  console.log("Page changed", e);
                  //check for e.detail.id if it's present then it's saveChanges otherwise the page hasn't been created yet
                },
                deleteButtonClick: async (e) => {
                  console.log("Page deleted", e);
                }
              }}
              mode="app"
              schedulerPreviewLink={`${window.location.origin}/scheduler/{config.id}`}
              nylasSessionsConfig={{
                clientId: nylasClientId, // Replace with your Nylas client ID from the previous
                redirectUri: `${window.location.origin}/editor`,
                domain: domain, // or 'https://api.eu.nylas.com/v3' for EU data center
                hosted: true,
                accessType: "offline",
              }}
              defaultAuthArgs={[{
                provider: "google",
                scope: [
                  "openid",
                  "https://www.googleapis.com/auth/userinfo.email",
                  "https://www.googleapis.com/auth/userinfo.profile",
                  "https://www.googleapis.com/auth/calendar",
                ],
                includeGrantScopes: false,
              }]}
              defaultSchedulerConfigState={{
                selectedConfiguration: {
                  requires_session_auth: false,
                  scheduler: {
                    // callback URLs to be set in email confirmation messages
                    rescheduling_url: `${window.location.origin}/scheduler/:config.id/reschedule/:booking_id`,
                    cancellation_url: `${window.location.origin}/scheduler/:config.id/cancel/:booking_id`,
                  },
                },
              }}
            >
            </Scheduler.NylasSchedulerEditor>
          );
        }}
      </ClientOnly>
    </div>
  );
}
