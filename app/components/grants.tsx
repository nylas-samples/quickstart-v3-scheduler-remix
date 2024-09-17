import { Link, useNavigate } from "@remix-run/react";
import { useMemo } from "react";
import { Grant } from "~/models/nylas/grant.server";
import Pagination from "./common/pagintation";
import { AccessType } from "./scheduler.editor";

function GrantView({ grant }: { grant: Grant }) {
  const navigate = useNavigate();
  const buttonStatus = useMemo(() => {
    if (grant.provider === "imap") {
      return {
        path: "/",
        buttonText: "Disabled",
        disabled: true,
        buttonCSS: "disabled:bg-red-300 hover:bg-red-700",
      };
    }
    if (grant.grantStatus === "invalid") {
      return {
        path: "/auth",
        buttonText: "Reconnect",
        disabled: false,
        buttonCSS: `bg-blue-600 hover:bg-blue-700`,
      };
    }

    return {
      path: `/editor?accessType=${AccessType.NONE}&email=${grant.email}&grantId=${grant.id}`,
      buttonText: "View Pages",
      disabled: false,
      buttonCSS: `bg-blue-600 hover:bg-blue-700`,
    };
  }, [grant]);

  return (
    <>
      <tr>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
          {grant.email}
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
          {grant.id}
        </td>
        <td
          className={`whitespace-nowrap px-4 py-2 ${
            grant.grantStatus === "valid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {grant.grantStatus}
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
          {grant.provider}
        </td>
        <td className="whitespace-nowrap px-4 py-2">
          <button
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onClick={(_e: unknown) => {
              return navigate(buttonStatus.path);
            }}
            disabled={buttonStatus.disabled}
            className={`inline-block rounded px-4 py-2 text-xs font-medium text-white ${buttonStatus.buttonCSS}`}
          >
            {buttonStatus.buttonText}
          </button>
        </td>
      </tr>
    </>
  );
}

export default function GrantListView({
  grants,
  limit,
  offset,
}: {
  grants: Grant[];
  limit: number;
  offset: number;
}) {
  const navigate = useNavigate();
  const paginationButtonState = useMemo(() => {
    if (!grants.length || grants.length < limit) {
      return {
        nextDisabled: offset > 0,
        prevDisabled: offset <= 0,
      };
    }
    if (offset <= 0) {
      return {
        nextDisabled: false,
        prevDisabled: true,
      };
    }

    return {
      nextDisabled: false,
      prevDisabled: false,
    };
  }, [grants, limit, offset]);

  const handlePagination = (method: "prev" | "next") => {
    if (method === "prev") {
      const newOffset = offset - limit;
      return navigate(`/grants?limit=${limit}&offset=${newOffset}`);
    }

    const newOffset = offset + limit;

    return navigate(`/grants?limit=${limit}&offset=${newOffset}`);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Email
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Grant ID
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Provider
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {grants.length ? (
              grants.map((grant: Grant) => {
                return <GrantView key={grant.id} grant={grant} />;
              })
            ) : (
              <>
                <div className="flex  m-auto items-center justify-center">
                  <div className="mx-auto max-w-xl px-4 py-8 text-center">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      No grants exist
                    </h3>

                    <p className="mt-4 text-gray-500">
                      Try connecting a grant or return home to start from the
                      beginning.
                    </p>

                    <Link
                      to="/auth"
                      className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
                    >
                      Connect an Account
                    </Link>
                  </div>
                </div>
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        handlePagination={handlePagination}
        nextDisabled={paginationButtonState.nextDisabled}
        prevDisabled={paginationButtonState.prevDisabled}
      />
    </>
  );
}
