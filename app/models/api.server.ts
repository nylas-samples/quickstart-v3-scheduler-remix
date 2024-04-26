/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "~/logger.server";
import configServer from "./config.server";

export enum AuthTypes {
  BASIC = "Basic",
  BEARER = "Bearer",
  API_KEY = "API_KEY",
  NONE = "NONE",
}

export type APIRequest = {
  url: string;
  config: RequestInit | undefined;
  authType: AuthTypes;
  token?: string;
  grantId?: string;
};
export interface APIResponse<T> {
  request_uid: string;
  data: T;
  next_cursor?: string;
}

export enum APIAction {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

//could use the auth decorator

export class ApiService {
  static async get<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);
    let res: APIResponse<T>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "GET",
      });
      res = await apiResponse.json();
      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error({ ...error, request: requestBody }, `GET request failed`);
      throw Error(error);
    }

    return res;
  }
  static async getAll<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);
    let res: APIResponse<T[]>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "GET",
      });
      res = await apiResponse.json();
      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error({ ...error, request: requestBody }, `GET request failed`);
      throw Error(error);
    }

    return res;
  }
  static async create<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);

    let res: APIResponse<T> = {} as APIResponse<T>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "POST",
      });
      res = await apiResponse.json();

      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error(
        { ...error, request: requestBody, res },
        `POST request failed`
      );
      throw Error(error);
    }

    return res;
  }
  static async update<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);
    let res: APIResponse<T>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "PUT",
      });
      res = await apiResponse.json();
      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error({ ...error, request: requestBody }, `PUT request failed`);
      throw Error(error);
    }

    return res;
  }
  static async delete<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);
    let res: APIResponse<T>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "DELETE",
      });
      res = await apiResponse.json();

      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error({ ...error, request: requestBody }, `DELETE request failed`);
      throw Error(error);
    }

    return res;
  }
  static async patch<T>(requestBody: APIRequest) {
    const request = this.addAuth(requestBody, requestBody.token);
    let res: APIResponse<T>;
    try {
      const apiResponse = await fetch(request.url, {
        ...request.config,
        method: "PATCH",
      });
      res = await apiResponse.json();
      if (apiResponse.status >= 400) {
        throw new Error(apiResponse.statusText);
      }
    } catch (error: any) {
      logger.error({ ...error, request: requestBody }, `PATCH request failed`);
      throw Error(error);
    }

    return res;
  }

  static addAuth(request: APIRequest, token?: string) {
    const requestCopy = { ...request };
    if (!requestCopy.config) return requestCopy;
    switch (request.authType) {
      case AuthTypes.BASIC:
      case AuthTypes.API_KEY: {
        requestCopy.config.headers = {
          ...requestCopy.config.headers,
          Authorization: `Bearer ${configServer.NYLAS_API_KEY}`,
        };
        return requestCopy;
      }
      case AuthTypes.BEARER: {
        if (!token) {
          return requestCopy;
        }

        requestCopy.config.headers = {
          ...requestCopy.config.headers,
          Authorization: `Bearer ${token}`,
        };

        return requestCopy;
      }
      default: {
        return requestCopy;
      }
    }
  }
}
