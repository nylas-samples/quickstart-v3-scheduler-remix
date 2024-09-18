import { logger } from "~/logger.server";
import { ApiService, AuthTypes } from "../api.server";
import configServer from "../config.server";
import {
  generateQueryString,
  transformListToCamelCase,
} from "../utils/utils.server";

export type Grant = {
  id: string;
  email: string;
  provider: string;
  grantStatus: string;
};

type GrantListQueryParams = Partial<{
  provider: string;
  limit: number;
  offset: number;
}>;

const API_ENDPOINT = `${configServer.API_ENDPOINT}/grants`;

const getGrants = async ({
  queryParams,
}: {
  queryParams?: GrantListQueryParams;
}) => {
  try {
    let queryParamsString = "";
    if (queryParams) {
      queryParamsString = generateQueryString(queryParams);
    }
    const { data } = await ApiService.getAll<Grant>({
      url: `${API_ENDPOINT}?${queryParamsString}`,
      config: {},
      authType: AuthTypes.API_KEY,
    });
    logger.info("Grants Fetched");
    return transformListToCamelCase(data) as Grant[];
  } catch (error) {
    logger.error(error);
  }
  return null;
};

export default {
  getGrants,
};
