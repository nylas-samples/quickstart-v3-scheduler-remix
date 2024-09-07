// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export type SessionData = Partial<{
  grantId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}>;

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

const getSessionValues = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  const grantId = session.get("grantId");
  const accessToken = session.get("accessToken");
  const email = session.get("email");
  const refreshToken = session.get("refreshToken");

  return { grantId, accessToken, email, refreshToken };
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
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

export {
  commitSession,
  destroySession,
  getSession,
  getSessionValues,
  setSession,
};
