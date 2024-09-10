/* eslint-disable @typescript-eslint/no-explicit-any */
import { camelCase, snakeCase } from "change-case/keys";

/**
 * Tool to convert the JS objects to snakeCase for API[configId,bookingId]
 * @param object
 * @returns keys transformed to snakeCase
 */

export function transformToSnakeCase(object: any) {
  return snakeCase(object);
}
export function transformToCamelCase(object: any) {
  return camelCase(object);
}

/**
 * Tool to convert the bookingRef to [configId,bookingId]
 * @param compactString
 * @returns [configurationId,bookingID]
 */
export function convertBookingRef(compactString: string) {
  // Decode the Base64 string to a Buffer
  const buffer = Buffer.from(compactString, "base64");

  // Extract each UUID's bytes (16 bytes each)
  const uuidBytes1 = buffer.slice(0, 16);
  const uuidBytes2 = buffer.slice(16, 32);

  // Function to convert a buffer to UUID string format
  function bufferToUUID(buffer: Buffer) {
    const hex = buffer.toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Convert buffers to UUID strings
  const uuid1 = bufferToUUID(uuidBytes1);
  const uuid2 = bufferToUUID(uuidBytes2);

  return [uuid1, uuid2];
}

type StringOrBoolean = string | boolean;

type StringKeys<T> = {
  [K in keyof T]: T[K] extends StringOrBoolean ? K : never;
}[keyof T];

export function parseQueryParams<T extends object>(
  searchParams: URLSearchParams,
  keys: StringKeys<T>[]
): T {
  return keys.reduce((acc: object, currKey: StringKeys<T>) => {
    const value = searchParams.get(currKey as string);
    if (value === "true" || value === "false") {
      return {
        ...acc,
        [currKey]: value === "true",
      };
    }
    if (value) {
      return {
        ...acc,
        [currKey]: value,
      };
    }
    return acc;
  }, {}) as T;
}

export function generateQueryString(queryParams: object) {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
