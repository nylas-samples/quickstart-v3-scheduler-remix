import { logger } from "~/logger.server";
import { ApiService, AuthTypes } from "../api.server";
import configServer from "../config.server";
import {
  generateQueryString,
  transformToSnakeCase,
} from "../utils/utils.server";

type CodeExchangeRequest = Partial<{
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
  grantType: "authorization_code" | "refresh_token";
}>;

const API_ENDPOINT = `${configServer.API_ENDPOINT}/connect`;

const generateAuthURL = (request: Request) => {
  const url = new URL(request.url);
  const queryParams = {
    clientId: configServer.NYLAS_CLIENT_ID,
    responseType: "code",
    redirectUri: `${url.origin}/callback`,
    accessType: "offline",
  };
  const queryString = generateQueryString(
    transformToSnakeCase(queryParams) as object
  );
  return `${API_ENDPOINT}/auth?${queryString}`;
};

const codeExchangeRequest = async ({
  code,
  origin,
  grantType = "authorization_code",
}: {
  code: string;
  grantType?: "authorization_code" | "refresh_token";
  origin?: string;
}) => {
  try {
    const codeExchangeBody: CodeExchangeRequest = {
      code,
      clientId: configServer.NYLAS_CLIENT_ID,
      clientSecret: configServer.NYLAS_API_KEY,
      redirectUri: `${origin}/callback`,
      grantType: grantType,
    };
    const data = await ApiService.create({
      url: `${API_ENDPOINT}/token`,
      config: {
        body: JSON.stringify(transformToSnakeCase(codeExchangeBody)),
        headers: {
          "Content-Type": "application/json",
          ...(origin && { Origin: origin }),
        },
      },
      authType: AuthTypes.NONE,
    });
    logger.info(data);
    return data;
  } catch (error) {
    logger.error(error);
  }
  return null;
};

export default {
  generateAuthURL,
  codeExchangeRequest,
};
