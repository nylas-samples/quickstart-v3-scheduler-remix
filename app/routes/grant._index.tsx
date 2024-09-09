import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AccessType } from "~/components/scheduler.editor";
import { generateQueryString } from "~/models/utils/utils.server";

// Server-side action to handle form data
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const grantId = formData.get("grantId");

  // Add server-side validation if needed
  if (!email || !grantId) {
    return { error: "Both fields are required." };
  }

  const queryString = generateQueryString({
    email,
    grantId,
    accessType: AccessType.NONE,
  });

  // Handle form data here (e.g., save to database)
  return redirect(`/editor?${queryString}`);
}

export default function GrantForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionData = useActionData() as any;
  return (
    <section className="dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://www.nylas.com/wp-content/uploads/main-logo.svg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Link className="block text-blue-600" to="/">
              <span className="sr-only">Home</span>
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
              Enter your Nylas Grant Details
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
              {actionData?.error && (
                <p style={{ color: "red" }}>{actionData.error}</p>
              )}
              {actionData?.success && (
                <p style={{ color: "green" }}>{actionData.success}</p>
              )}
            </p>

            <Form method="POST" className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="grantId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Grant ID
                </label>

                <input
                  type="text"
                  id="grantId"
                  name="grantId"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                >
                  Continue
                </button>
              </div>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
}
