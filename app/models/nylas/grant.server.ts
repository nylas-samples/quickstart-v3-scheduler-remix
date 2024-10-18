import { logger } from "~/logger.server";
import { ApiService, AuthTypes } from "../api.server";
import configServer from "../config.server";
import {
  generateQueryString,
  transformListToCamelCase,
} from "../utils/utils.server";

/**
 * Type Grant
 * @param id - ID of the grant
 * @param email - Email of the grant
 * @param provider - Provider of the grant
 * @param grantStatus - Status of the grant
 */

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

/**
 * Get Grants
 * @param queryParams - GrantListQueryParams
 * @returns - List of Grants
 */

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
