import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GrantListView from "~/components/grants";
import { Grant } from "~/models/nylas/grant.server";
import { parseQueryParams } from "~/models/utils/utils.server";

type LoaderData = {
  grants: Grant[];
  limit: number;
  offset: number;
};

const defaultGrants = [
  {
    id: "db0b25ba-980a-4ad7-bab4-10d613ed1f65",
    grantStatus: "valid",
    provider: "ews",
    scope: ["ews.calendars", "ews.messages", "ews.contacts"],
    email: "alex.doe@nylas.org",
    createdAt: 1724853528,
    updatedAt: 1724853528,
  },
  {
    id: "ed9ee6ec-ab69-4825-ae8f-bfcefafdbf77",
    grantStatus: "valid",
    provider: "ews",
    scope: ["ews.calendars", "ews.messages", "ews.contacts"],
    email: "test@nylas.info",
    createdAt: 1724865480,
    updatedAt: 1724865480,
  },
  {
    id: "4e3889b5-4d39-4f61-a4f2-34684f30782a",
    grantStatus: "valid",
    provider: "google",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar",
    ],
    state: "test",
    email: "kirantestnylas1@gmail.com",
    settings: {},
    ip: "24.13.206.255",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    createdAt: 1701721484,
    updatedAt: 1724782700,
    providerUserId: "102506000108868859977",
  },
  {
    id: "5c97f78a-923a-469a-b78f-96b33355ce1d",
    grantStatus: "valid",
    provider: "google",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/contacts",
      "https://www.googleapis.com/auth/contacts.other.readonly",
    ],
    email: "kirantestnylas@gmail.com",
    settings: {},
    ip: "24.13.206.255",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    createdAt: 1722288474,
    updatedAt: 1726080010,
    providerUserId: "113771326161061481099",
  },
  {
    id: "77c66b65-0f99-49a5-bfeb-f2df6808af0d",
    grantStatus: "valid",
    provider: "google",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/contacts",
      "https://www.googleapis.com/auth/contacts.other.readonly",
    ],
    state: "Test",
    email: "kirantestnylas5@gmail.com",
    settings: {},
    ip: "24.13.206.255",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    createdAt: 1725888488,
    updatedAt: 1725920672,
    providerUserId: "104266501853936394636",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  //TODO: Request Grants view and handle query params

  const url = new URL(request.url);

  let queryParams = {
    limit: 5,
    offset: 0,
  };
  const parsedQueryParams = parseQueryParams<typeof queryParams>(
    url.searchParams,
    ["limit", "offset"]
  );

  if (parsedQueryParams.limit && parsedQueryParams.offset) {
    queryParams = {
      limit: parsedQueryParams.limit,
      offset: parsedQueryParams.offset,
    };
  }

  //const grants = await grantServer.getGrants({ queryParams });

  return json({
    grants: defaultGrants,
    ...queryParams,
  });
}

export default function Grants() {
  const { grants, limit, offset } = useLoaderData<LoaderData>();
  return (
    <section className="dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
              Grants view
            </h1>
          </div>
        </main>
      </div>
      <div className=" m-auto flex h-full items-center justify-center">
        <GrantListView grants={grants} limit={limit} offset={offset} />
      </div>
    </section>
  );
}
