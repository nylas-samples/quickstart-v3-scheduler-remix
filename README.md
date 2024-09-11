# Nylas v3 Scheduler!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features for Remix project.

## Prerequisites

- Add environment variable to your project

```shellscript
      NYLAS_CLIENT_ID=
      NYLAS_API_KEY=
      API_ENDPOINT=https://api.us.nylas.com/v3
```

- Add two redirect_uri as `JavaScript` to your Nylas application
  - `http://localhost:{port}/editor` - Standard Editor Auth
  - `http://localhost:{port}/callback` - Access Token Flow

Run the Vite dev server:

```shellscript
npm install
```

```shellscript
npm run dev
```

## Overview

The v3-scheduler repository is a sample project designed to test the NylasSchedulerEditor and NylasScheduling components.

It supports the following flows:

- `Standard Editor Flow`: Requires the user to re-authenticate for each session.
- `Access Token Flow`: Utilizes an access token for users who have already authenticated within the same origin.
- `No Auth Flow`: Allows use of the editor without re-authentication, provided the account has been authenticated previously.

## Routes

- `/editor` - Where the Editor component is rendered
- `/scheduler/:configurationId` - Where the NylasScheduling component is rendered
- `/scheduler/auth` - Where the access token flow is triggered from for `Access Token Flow`
- `/scheduler/api` - An API route in remix to make proxy requests for `No Auth Flow`

## Query Params

`/editor` route supports these query parameters:

```typescript
export type EditorQueryParams = {
  configurationId: string; // Used to default to specific configuration
  requiresSlug: boolean; // Used to trigger the Hosted Scheduling pages
  accessType: AccessType; // Used to define which flow the NylasSchedulerEditor operates in. By default it's the Standard flow
  email: string; // Used for No Auth flow
  grantId: string; // Used for No Auth flow
};
```

`/scheduler/:configurationId` route supports these query parameters:

```typescript
// Used to prefill the booking form
export type SchedulerCustomQueryParams = {
  name: string;
  email: string;
};
```

## Access Token Flow

- Users will authenticate using OAuth within the same origin.
- The flow conducts a code exchange and securely stores user credentials in server-side sessions via cookies.

The `CustomIdentityRequestWrapperAccessToken` class is used to make scheduler requests on behalf of an already authenticated user.

> 💡 **Note:** This is an important note.

- This flow is applicable only if you are storing both the access_token and refresh_token associated with the origin where the component is embedded. It follows a similar approach to the one used by our Standard Editor flow.

## No Auth Flow

- This flow utilizes the `CustomIdentityRequestWrapperProxy` class to proxy scheduler component requests to your backend.
- It eliminates the need for user authentication to access the `NylasSchedulerEditor` component.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.
