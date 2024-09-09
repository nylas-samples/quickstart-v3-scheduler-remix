# Nylas v3 Scheduler!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features for Remix project.

## Development

- Add environment variable to your project
  - ```shellscript
      NYLAS_CLIENT_ID=
      NYLAS_API_KEY=
      API_ENDPOINT=https://api.us.nylas.com/v3
      AUTH_REDIRECT_URI=http://localhost:5173/callback
      #this value has to be the host where this application is running
      ORIGIN=http://localhost:5173
    ```
- Add redirect_uri as `JavaScript` to your Nylas application
  - `http://localhost:{port}/editor`

Run the Vite dev server:

```shellscript
npm install
```

```shellscript
npm run dev
```

## Overview

v3-scheduler repository is a sample reposiroty to test scheduler editor and NylasSchedulingComponent

It supports

- Standard Editor Flow: Requires the user to re-authenticate.
- Access Token Flow: The user has previously authenticated within the same origin and has an access token associated with that origin.
- No Auth Flow: If an account has been authenticated previously, you can use the editor without re-authentication.

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

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
