import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { logger } from "~/logger.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const challenge = url.searchParams.get("challenge");

  if (!challenge) {
    return new Response(null, {
      status: 400,
    });
  }

  return new Response(challenge, {
    status: 200,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();

  logger.info("Webhook received", { body });

  return new Response(null, {
    status: 200,
  });
}
