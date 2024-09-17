import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Grant } from "~/models/nylas/grant.server";
import { AccessType } from "./scheduler.editor";

function GrantView({ grant }: { grant: Grant }) {
  const navigate = useNavigate();
  const [buttonStatus] = useState<{
    path: string;
    buttonText: string;
    disabled: boolean;
  }>(() => {
    if (grant.provider === "imap") {
      return {
        path: "/",
        buttonText: "Disabled",
        disabled: true,
      };
    }
    if (grant.grantStatus === "invalid") {
      return {
        path: "/auth",
        buttonText: "Reconnect",
        disabled: false,
      };
    }

    return {
      path: `/editor?accessType=${AccessType.NONE}&email=${grant.email}&grantId=${grant.id}`,
      buttonText: "View Pages",
      disabled: false,
    };
  });

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
            className={`inline-block rounded px-4 py-2 text-xs font-medium text-white${
              buttonStatus.disabled
                ? "bg-red-300 hover:bg-red-700"
                : " bg-blue-600 hover:bg-blue-700 "
            }`}
          >
            {buttonStatus.buttonText}
          </button>
        </td>
      </tr>
    </>
  );
}

export default function GrantListView({ grants }: { grants: Grant[] }) {
  return (
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
          {grants.map((grant: Grant) => {
            return <GrantView key={grant.id} grant={grant} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
