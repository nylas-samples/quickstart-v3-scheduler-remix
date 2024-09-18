import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import FallBack from "~/components/fallback";
import GrantListView from "~/components/grants";
import grantServer from "~/models/nylas/grant.server";
import { parseQueryParams } from "~/models/utils/utils.server";

export async function loader({ request }: LoaderFunctionArgs) {
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

  const grants = await grantServer.getGrants({ queryParams });

  return json({
    grants,
    ...queryParams,
  });
}

export default function Grants() {
  const { grants, limit, offset } = useLoaderData<typeof loader>();
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
      <div className=" m-auto flex flex-col h-full items-center justify-center">
        <Suspense fallback={<FallBack />}>
          <Await resolve={grants}>
            {(grants) => (
              <GrantListView
                grants={grants ?? []}
                limit={limit}
                offset={offset}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
