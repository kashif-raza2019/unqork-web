import axios from "axios";
import { readFileSync } from "node:fs";
import { ACCESS_TOKEN_URI, AVAILABLE_PROXY_METHODS } from "../helpers/ServiceEndpoints.js";
import { include } from "../helpers/functions.js";
import { UNQORK_API_VERSION } from "../env/version.js";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const DEFAULT_TIMEOUT_MS = 36000;
const DEFAULT_TOKEN_REFRESH_BUFFER_SECONDS = 240;

const loadSwaggerDoc = () => {
  const swaggerPath = new URL("./swagger-doc.json", import.meta.url);
  return JSON.parse(readFileSync(swaggerPath, "utf-8"))?.swaggerDoc ?? { paths: {} };
};

const SWAGGER_DOC = loadSwaggerDoc();

const buildOperationsMap = (swaggerDoc) => {
  const operationsMap = new Map();
  const paths = swaggerDoc?.paths ?? {};

  Object.entries(paths).forEach(([path, pathDefinition]) => {
    Object.entries(pathDefinition).forEach(([method, definition]) => {
      const normalizedMethod = method.toLowerCase();
      if (!HTTP_METHODS.includes(normalizedMethod)) {
        return;
      }

      const operationId = definition?.operationId;
      if (!operationId) {
        return;
      }

      operationsMap.set(operationId, {
        operationId,
        method: normalizedMethod,
        path,
        summary: definition?.summary,
        tags: definition?.tags ?? [],
        description: definition?.description ?? "",
      });
    });
  });

  return operationsMap;
};

const SWAGGER_OPERATIONS = buildOperationsMap(SWAGGER_DOC);

class Unqork {
  constructor({
    environment,
    client_id,
    client_secret,
    isAuthenticated = true,
    timeout = DEFAULT_TIMEOUT_MS,
  }) {
    if (!environment) {
      throw new Error("Missing required parameter: environment");
    }

    this.environment = environment;
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.timeout = timeout;
    this.isAuthenticated = isAuthenticated;

    this.platformDesignerURL = `https://${this.environment}.unqork.io/${UNQORK_API_VERSION}`;
    this.platformExpressURL = `https://${this.environment}x.unqork.io/fbu/uapi`;

    this.unqorkAccessTokenURI = `https://${this.environment}x.unqork.io/${ACCESS_TOKEN_URI}`;

    this.access_token = null;
    this.expiresIn = null;
    this._refreshInFlight = null;
    this.UnqorkAxiosInstance = axios.create({
      baseURL: this.platformExpressURL,
      timeout: this.timeout,
    });
  }

  _isAbsoluteUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

  _isTokenStale = () => {
    if (!this.access_token || !this.expiresIn) {
      return true;
    }

    const epochNow = Math.floor(Date.now() / 1000);
    return this.expiresIn < epochNow + DEFAULT_TOKEN_REFRESH_BUFFER_SECONDS;
  };

  _formatAxiosError = (error) => {
    if (error?.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      const details = typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data);

      return new Error(`Request failed with status ${status} (${statusText}): ${details}`);
    }

    if (error?.request) {
      return new Error("Request failed: no response received from Unqork service");
    }

    return new Error(error?.message || "Unknown request error");
  };

  _normalizeQuery = (query) => {
    if (query === null || query === undefined || query === "") {
      return "";
    }

    if (typeof query === "string") {
      return query.startsWith("?") ? query.slice(1) : query;
    }

    if (query instanceof URLSearchParams) {
      return query.toString();
    }

    if (typeof query === "object") {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
          return;
        }

        params.append(key, String(value));
      });
      return params.toString();
    }

    throw new Error("Invalid query value. Use string, object, or URLSearchParams.");
  };

  _applyPathParams = (pathTemplate, pathParams = {}) => {
    if (!pathTemplate || typeof pathTemplate !== "string") {
      throw new Error("Path template must be a non-empty string");
    }

    return pathTemplate.replace(/\{([^}]+)\}/g, (_, key) => {
      const value = pathParams[key];
      if (value === undefined || value === null || value === "") {
        throw new Error(`Missing required path parameter: ${key}`);
      }

      return encodeURIComponent(String(value));
    });
  };

  _appendQuery = (url, query) => {
    const normalized = this._normalizeQuery(query);
    if (!normalized) {
      return url;
    }

    const hasQuery = url.includes("?");
    return `${url}${hasQuery ? "&" : "?"}${normalized}`;
  };

  _resolvePath = (pathOrUri) => {
    if (!pathOrUri) {
      throw new Error("Missing required endpoint path/uri");
    }

    if (this._isAbsoluteUrl(pathOrUri)) {
      return pathOrUri;
    }

    if (pathOrUri.startsWith("/fbu/uapi")) {
      return pathOrUri.replace("/fbu/uapi", "");
    }

    return pathOrUri;
  };

  refreshAccessToken = async () => {
    if (!this.client_id || !this.client_secret) {
      throw new Error("client_id and client_secret are required for authenticated requests");
    }

    try {
      const refreshResponse = await axios.post(this.unqorkAccessTokenURI, {
        grant_type: "password",
        username: this.client_id,
        password: this.client_secret,
      });

      this.access_token = refreshResponse?.data?.access_token ?? null;
      const expiresInSeconds = Number(refreshResponse?.data?.expires_in ?? 0);
      this.expiresIn = Math.floor(Date.now() / 1000) + expiresInSeconds;

      if (!this.access_token) {
        throw new Error("Token response did not include access_token");
      }

      return this.access_token;
    } catch (error) {
      throw this._formatAxiosError(error);
    }
  };

  connect = async () => {
    try {
      await this.refreshAccessToken();
      return 1;
    } catch (error) {
      return 0;
    }
  };

  checkAccessToken = async () => {
    if (!this.isAuthenticated) {
      return null;
    }

    if (!this._isTokenStale()) {
      return this.access_token;
    }

    if (!this._refreshInFlight) {
      this._refreshInFlight = this.refreshAccessToken()
        .finally(() => {
          this._refreshInFlight = null;
        });
    }

    await this._refreshInFlight;
    return this.access_token;
  };

  createAxiosInstance = async () => {
    this.UnqorkAxiosInstance = axios.create({
      baseURL: this.platformExpressURL,
      timeout: this.timeout,
    });

    return this.UnqorkAxiosInstance;
  };

  request = async ({
    method,
    path,
    uri,
    query,
    pathParams,
    data,
    headers,
    authenticated = true,
  }) => {
    const normalizedMethod = String(method || "").toLowerCase();

    if (!include(HTTP_METHODS, normalizedMethod)) {
      throw new Error(`Invalid method \"${method}\". Allowed: GET, POST, PUT, PATCH, DELETE`);
    }

    if (!this.UnqorkAxiosInstance) {
      await this.createAxiosInstance();
    }

    const endpointTemplate = path ?? uri;
    const withPathParams = pathParams
      ? this._applyPathParams(endpointTemplate, pathParams)
      : endpointTemplate;

    const resolvedPath = this._resolvePath(withPathParams);
    const url = this._appendQuery(resolvedPath, query);

    const requestHeaders = { ...(headers || {}) };

    if (authenticated && this.isAuthenticated) {
      requestHeaders.Authorization = `Bearer ${await this.checkAccessToken()}`;
    }

    try {
      const response = await this.UnqorkAxiosInstance.request({
        method: normalizedMethod,
        url,
        data,
        headers: requestHeaders,
      });

      return response.data;
    } catch (error) {
      throw this._formatAxiosError(error);
    }
  };

  execute = async (method, uri, request_body) => {
    return this.request({
      method,
      uri,
      data: request_body,
      authenticated: this.isAuthenticated,
    });
  };

  getAvailableOperations = (tag) => {
    const all = Array.from(SWAGGER_OPERATIONS.values());
    if (!tag) {
      return all;
    }

    const normalizedTag = String(tag).toLowerCase();
    return all.filter((operation) => operation.tags.some((item) => String(item).toLowerCase() === normalizedTag));
  };

  callOperation = async (operationId, {
    pathParams,
    query,
    data,
    headers,
    authenticated = true,
  } = {}) => {
    const operation = SWAGGER_OPERATIONS.get(operationId);

    if (!operation) {
      throw new Error(`Unknown operationId: ${operationId}`);
    }

    return this.request({
      method: operation.method,
      path: operation.path,
      pathParams,
      query,
      data,
      headers,
      authenticated,
    });
  };

  executeModule = async (moduleId, request_body = {}) => {
    return this.callOperation("executeModule", {
      pathParams: { moduleId },
      data: request_body,
    });
  };

  executeViaProxy = async (method, moduleId, request_body, query) => {
    const methodLower = String(method || "").toLowerCase();

    if (!include(AVAILABLE_PROXY_METHODS, methodLower)) {
      throw new Error(`Invalid proxy method \"${method}\". Allowed: GET, POST, PUT, PATCH, DELETE`);
    }

    return this.request({
      method: methodLower,
      path: `/modules/${moduleId}/api`,
      data: request_body,
      query,
    });
  };

  getModuleComponents = async (moduleId, locale) => {
    const query = locale ? { locale } : undefined;
    return this.callOperation("getModuleComponents", {
      pathParams: { moduleId },
      query,
    });
  };

  getRowsFromTable = async (table, filter, limit) => {
    const query = new URLSearchParams();

    if (filter && filter !== "none") {
      const normalizedFilter = String(filter).replace(/^\?/, "");
      normalizedFilter.split("&").forEach((entry) => {
        if (!entry) {
          return;
        }

        const [key, value] = entry.split("=");
        if (key) {
          query.append(key, value ?? "");
        }
      });
    }

    if (limit !== undefined && limit !== null && Number(limit) > 0) {
      query.set("limit", String(limit));
    }

    return this.callOperation("getRowsFromDataCollection", {
      pathParams: { table },
      query,
    });
  };

  getDistinctValuesFromTable = async (table, distinctField, filter) => {
    const query = new URLSearchParams({ distinct: String(distinctField) });

    if (filter && filter !== "none") {
      const normalizedFilter = String(filter).replace(/^\?/, "");
      normalizedFilter.split("&").forEach((entry) => {
        if (!entry) {
          return;
        }

        const [key, value] = entry.split("=");
        if (key) {
          query.append(key, value ?? "");
        }
      });
    }

    return this.callOperation("getDistinctValuesFromDataCollection", {
      pathParams: { table },
      query,
    });
  };

  getModuleSubmissions = async (moduleId, queryParams) => {
    return this.callOperation("getModuleSubmissions", {
      pathParams: { moduleId },
      query: queryParams,
    });
  };

  getWorkflowSubmissions = async (workflowId, queryParams) => {
    return this.callOperation("getWorkflowSubmissions", {
      pathParams: { workflowId },
      query: queryParams,
    });
  };

  listSubmissionsDashboard = async (moduleId, queryParams) => {
    const baseQuery = new URLSearchParams({ moduleId: String(moduleId) });

    if (queryParams) {
      const normalized = String(queryParams).replace(/^\?/, "");
      normalized.split("&").forEach((entry) => {
        if (!entry) {
          return;
        }

        const [key, value] = entry.split("=");
        if (key) {
          baseQuery.append(key, value ?? "");
        }
      });
    }

    return this.callOperation("listSubmissionsForDashboard", {
      query: baseQuery,
    });
  };

  getSubmission = async (schemaType, schemaId, submissionId, queryParams) => {
    if (schemaType === "module") {
      return this.callOperation("getModuleSubmission", {
        pathParams: { moduleId: schemaId, submissionId },
        query: queryParams,
      });
    }

    if (schemaType === "workflow") {
      return this.callOperation("getWorkflowSubmission", {
        pathParams: { workflowId: schemaId, submissionId },
        query: queryParams,
      });
    }

    throw new Error(`Invalid schemaType: ${schemaType}. Allowed: \"module\", \"workflow\"`);
  };

  createModuleSubmission = async (moduleId, requestBody, transformName) => {
    if (typeof requestBody !== "object" || requestBody === null) {
      throw new Error("Invalid request body, please pass a JSON object");
    }

    const query = transformName ? { transformName } : undefined;
    return this.callOperation("createModuleSubmissions", {
      pathParams: { moduleId },
      query,
      data: requestBody,
    });
  };

  restoreSubmission = async (schemaType, schemaId, submissionId) => {
    try {
      if (schemaType === "module") {
        await this.callOperation("restoreDeletedModuleSubmission", {
          pathParams: { moduleId: schemaId, submissionId },
        });
        return true;
      }

      if (schemaType === "workflow") {
        await this.callOperation("restoreDeletedWorkflowSubmission", {
          pathParams: { workflowId: schemaId, submissionId },
        });
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  updateSubmission = async (schemaType, schemaId, submissionId, requestBody, replaceData = false) => {
    const query = replaceData ? { replaceData: true } : undefined;

    if (schemaType === "module") {
      return this.callOperation("updateModuleSubmission", {
        pathParams: { moduleId: schemaId, submissionId },
        query,
        data: requestBody,
      });
    }

    if (schemaType === "workflow") {
      return this.callOperation("updateWorkflowSubmission", {
        pathParams: { workflowId: schemaId, submissionId },
        query,
        data: requestBody,
      });
    }

    throw new Error(`Invalid schemaType: ${schemaType}. Allowed: \"module\", \"workflow\"`);
  };

  deleteSubmissions = async (schemaType, schemaId, submissionIds, isHardDelete = false) => {
    if (!submissionIds) {
      throw new Error("Please pass valid submissionId(s) to be deleted");
    }

    const query = {
      ids: submissionIds,
      destroy: String(Boolean(isHardDelete)),
    };

    try {
      if (schemaType === "module") {
        await this.callOperation("deleteModuleSubmissions", {
          pathParams: { moduleId: schemaId },
          query,
        });
        return true;
      }

      if (schemaType === "workflow") {
        await this.callOperation("deleteWorkflowSubmissions", {
          pathParams: { workflowId: schemaId },
          query,
        });
        return true;
      }

      throw new Error(`Invalid schemaType: ${schemaType}. Allowed: \"module\", \"workflow\"`);
    } catch (error) {
      return false;
    }
  };

  createWorkflowSubmission = async (workflowPath, requestBody = {}) => {
    return this.callOperation("createWorkflowSubmission", {
      pathParams: { workflowPath },
      data: requestBody,
    });
  };
}

export default Unqork;
