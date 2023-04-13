import axios, {
  CancelTokenSource,
  AxiosError,
  isAxiosError,
  RawAxiosRequestConfig,
} from "axios";
import { toast } from "react-hot-toast";
import { Model, ModelPK, Paginated } from "./models";
import { tokens } from "../hooks/useJWTAuth";

const cancelTokens: Record<string, CancelTokenSource> = {};

export type HttpReqMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Api = `${HttpReqMethod} ${string}`;

export interface FireRequestOptions {
  key?: string;
  noAuth?: boolean;
  rewrites?: Record<string, string | number>;
  query?: Record<string, string>;
}

/**
 * Generic HTTP API request dispatcher built around axios.
 */
const fireRequest = <T>(
  api: Api,
  body: Record<string, unknown> | FormData = {},
  options: FireRequestOptions = {}
) => {
  // Parse the API request method and endpoints
  const request = parseApi(api);

  // Identify key to allow cancellation later if necessary.
  const key = options.key || request.path;

  // Cancel previous API call on endpoint.
  if (cancelTokens[key]) cancelTokens[key].cancel();
  cancelTokens[key] = axios.CancelToken.source();

  // Rewrite the path if necessary.
  if (options.rewrites) {
    for (const [key, value] of Object.entries(options.rewrites)) {
      request.path = request.path.replace(":" + key, value.toString());
    }
  }

  // Add query params if necessary.
  if (options.query) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query || {})) {
      queryParams.append(key, value);
    }
    request.path += `?${queryParams.toString()}`;
  }

  // set authorization header in the request header
  const axiosConfig = { headers: {} };

  const accessToken = tokens().access;
  if (accessToken && !options.noAuth) {
    axiosConfig.headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const { method, path } = request;
  const instance = axios.create({ ...axiosConfig });
  const config: RawAxiosRequestConfig = {
    cancelToken: cancelTokens[key].token,
  };

  if (method === "GET") return instance.get<T>(path, config);
  if (method === "POST") return instance.post<T>(path, body, config);
  if (method === "PUT") return instance.put<T>(path, body, config);
  if (method === "PATCH") return instance.patch<T>(path, body, config);
  if (method === "DELETE") return instance.delete<T>(path, config);
  return instance.options<T>(path, config);
};

export default fireRequest;

const parseApi = (api: Api) => {
  const [method, path] = api.split(" ");
  return { method: method as HttpReqMethod, path };
};

export interface ErrorResponse {
  detail: string;
}

export const handleFireRequestError = (
  callback?: (error: AxiosError<ErrorResponse>) => void
) => {
  return (error: any) => {
    if (error && isAxiosError(error)) {
      if (error.code === "ERR_CANCELED") return;
      const status = error.response?.status;

      switch (status) {
        case 401:
          toast.error("You are not authorized to perform this action");
          break;
        case 403:
          toast.error("You are not allowed to perform this action");
          break;
        case 404:
          toast.error("The requested resource was not found");
          break;
        case 500:
          toast.error("Something went wrong on the server");
          break;
        case 502:
          toast.error("The server is down");
          break;
        default:
          toast.error(error.response?.data.detail || "Something went wrong");
          break;
      }

      return callback && callback(error);
    }
    toast.error("Unknown error occurred");
  };
};

export const modelEndpoints = <T extends object>(
  baseUrl: string,
  commonOptions: FireRequestOptions = {}
) => {
  const _ = (options: FireRequestOptions) => ({ ...commonOptions, ...options });

  return {
    /** Lists all objects of the model. */
    list: (options: FireRequestOptions = {}) => {
      return fireRequest<Paginated<Model<T>>>(`GET ${baseUrl}`, {}, _(options));
    },

    /** Creates a new object of the model. */
    create: (obj: Partial<T>, options: FireRequestOptions = {}) => {
      return fireRequest<Model<T>>(`POST ${baseUrl}`, obj, _(options));
    },

    /** Reads an object of the model. */
    read: (id: ModelPK, options: FireRequestOptions = {}) => {
      return fireRequest<Model<T>>(`GET ${baseUrl}${id}/`, {}, _(options));
    },

    /** Updates an object of the model. */
    update: (
      id: ModelPK,
      obj: Partial<T>,
      options: FireRequestOptions = {}
    ) => {
      return fireRequest<Model<T>>(`PUT ${baseUrl}${id}/`, obj, _(options));
    },

    /** Partially updates an object of the model. */
    partialUpdate: (
      id: ModelPK,
      obj: Partial<Partial<T>>,
      options: FireRequestOptions = {}
    ) => {
      return fireRequest<Model<T>>(`PATCH ${baseUrl}${id}/`, obj, _(options));
    },

    /** Deletes an object of the model. */
    delete: (id: ModelPK, options: FireRequestOptions = {}) => {
      return fireRequest<Model<T>>(`DELETE ${baseUrl}${id}/`, {}, _(options));
    },
  };
};
