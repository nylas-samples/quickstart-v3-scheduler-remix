// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  grantId: string;
  provider: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

type SessionFlashData = {
  error: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setSession = async (payload: any) => {
  const session = await getSession();

  session.set("grantId", payload.grantId);
  session.set("accessToken", payload.accessToken);
  session.set("email", payload.email);
  session.set("refreshToken", payload.refreshToken);

  return session;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
      domain: "remix.run",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession, setSession };
