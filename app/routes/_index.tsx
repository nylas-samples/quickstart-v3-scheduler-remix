import { Link } from "@remix-run/react";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Home() {
  return (
    <div className="max-h-screen-xl">
      <section className="bg-gray-900 text-white">
        <div className="mx-auto h-6/6 max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Nylas v3 Scheduler
            </h2>

            <p className="mt-4 text-gray-300">
              The v3 Nylas Scheduler introduces a robust, flexible, secure
              scheduling solution that you can build seamlessly into your
              applications. With the v3 Scheduler API and Scheduler UI
              Components, you can manage bookings, design complex scheduling
              flows, customize the UI, and much more.
            </p>
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/editor"
              className="inline-block rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Get Started Today
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 md:grid-cols-2 sm:grid-cols-3">
            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://www.nylas.com/blog/nylas-scheduler-v3-announcement"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">Blog Post</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://developer.nylas.com/docs/new/release-notes/2024-04-30-scheduler-v3-beta/"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">
                Release Notes
              </h2>
            </a>

            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://developer.nylas.com/docs/v3/quickstart/scheduler/"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">Quickstart</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://developer.nylas.com/docs/v3/scheduler/"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">
                Getting Started
              </h2>
            </a>

            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://nylas-scheduler-ui-components.pages.dev/"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">
                Components Reference
              </h2>
            </a>

            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="https://developer.nylas.com/docs/api/v3/scheduler/"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-white">
                API Reference
              </h2>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
