/**
 * Unqork Class Instance
 * 
 */

import axios from "axios";
import { ACCESS_TOKEN_URI, AVAILABLE_PROXY_METHODS } from "../helpers/ServiceEndpoints.js";
import { include } from "../helpers/functions.js"


/**
 * Create a new Instance of Unqork
 * 
 * @param {Object} {environment, client_id, client_secret}
 * 
 * Usage Example:
 * ```js
 * const UnqorkWeb = new Unqork({
 *    environment: "test", // for test.unqork.io
 *    client_id: process.env.UNQORK_CLIENT_ID, 
 *    client_secret: process.env.UNQORK_CLIENT_SECRET
 *  })
 * ```
 * 
 * @return {Unqork} A new Unqork Instance
 */

class Unqork {

    /**
     * @param {*} constructor 
     */
    constructor({
        // https://test.unqork.io --> environment : test
        environment,
        // Client ID or Username
        client_id,
        // Client Secret or Password
        client_secret,
        isAuthenticated,
    }) {
        this.environment = environment;
        this.client_id = client_id;
        this.client_secret = client_secret;

        // Desginer URL
        this.platformDesignerURL = `https://${this.environment}.unqork.io/`;

        //Express URL
        this.platformExpressURL = `https://${this.environment}x.unqork.io/`;

        // Boolean indicates if the server needs authentication
        // For now this is defaulted to "true"
        this.isAuthenticated = true
    }

    /**
     * Connect with Unqork Environment and generate access token
     * @param {} //No Params
     * 
     * @function access_token SET Access Token
     * 
     * 
     * 0 - Not connected, no access token generated
     * 1 - Access Token generated
     * 2 - Not connected, awaiting confirmation
     * @return {Number}
     */
    connect = async () => {
        try {

            let unqorkAccessTokenURI = `https://${this.environment}x.unqork.io/${ACCESS_TOKEN_URI}`;

            const access_data = await axios.post(unqorkAccessTokenURI, {
                grant_type: "password",
                username: this.client_id,
                password: this.client_secret
            })
            this.access_token = access_data.data.access_token;
            if ((this.access_token.length) > 0) {
                this.createAxiosInstance();
                return 1;
            }
            return 2;
        } catch (error) {
            console.log(error);
            return 0;

        }

    }

    createAxiosInstance = async () => {
        try {
            let headers = {}

            if (this.isAuthenticated) {
                headers = {
                    Authorization: `Bearer ${this.access_token}`
                }
            }

            this.UnqorkAxiosInstance = await axios.create({
                baseURL: this.platformExpressURL,
                timeout: 36000,
                headers: headers
            });
            return this.UnqorkAxiosInstance;

        } catch (error) {
            throw new Error(`Error creating axios instance for ${this.platformExpressURL}, error: ${error}`)
        }
    }

    execute = async (method, uri, request_body) => {

        // console.log("Execute Started");

        method = method.toLowerCase();

        if (!include(AVAILABLE_PROXY_METHODS, method)) {
            throw new Error(`Invalid "${method}" method, The method allowed are ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']`)
        }

        try {

            let res = {};

            if (request_body !== undefined || request_body !== null) {
                // console.log("Execute with request triggered");
                res = await this.UnqorkAxiosInstance({
                    method: method,
                    url: uri,
                    data: request_body
                })
            } else {
                // console.log("Execute without request triggered");
                res = await this.UnqorkAxiosInstance({
                    method: method,
                    url: uri
                })
            }
            // console.log("Response", res);
            return res.data;

        } catch (error) {
            console.log(error);
            return error;
        }
    }

    /**
     *  Service Definitions Starts from here
     */

    // Module Related Definitions

    /**
     * Module Execute
     * 
     * @param {Object} 
     * 
     * Example
     * ```
     * {
     *   moduleId: "",
     *   request_body: {}
     * }
     * 
     * ```
     * 
     * @return {Object} Response from Module Execute
     * 
     */
    executeModule = async (moduleId, request_body) => {

        // Service URI
        let uri = `fbu/uapi/modules/${moduleId}/execute`;
        try {

            //console.log(this.UnqorkAxiosInstance)
            const response = await this.execute("put", uri, request_body)
            return response;

        } catch (error) {
            throw new Error(`Error in executing the module ${moduleId} with URL: ${uri}, 
                error reason: ${error}
                `)
        }

    }

    /**
     * Execute Module via Proxy
     * @param {Object} { method, moduleId, request_body}
     * Example Execution
     * ```js
     *      const response = await unqorkInstance.executeViaProxy("POST", "674sf335bvdvhb4vhndvvr", {//request body})
     * ```
     * 
     * @return {Object} Response from Module Execute via Proxy
     * Example Return Object
     * ```js
     * {
     *      "id": "string",
     *      "userId": "string",
     *      "moduleId": "string",
     *       "created": "2024-12-29T11:43:13.671Z",
     *       "modified": "2024-12-29T11:43:13.671Z",
     *       "deleted": "2024-12-29T11:43:13.671Z",
     *       "data": {
     *           "rawData": {},
     *           "resolved": {}
     *       },
     *       "metadata": {},
     *       "validationErrors": [
     *           {
     *           "id": "string",
     *           "path": "string",
     *           "label": "string",
     *           "parent": "string",
     *           "message": "string"
     *           }
     *       ],
     *       "invalidNavigationPanels": [
     *           {
     *           "key": "string",
     *           "label": "string"
     *           }
     *       ]
     *       }
     * ```
     */
    executeViaProxy = async (method, moduleId, request_body, query) => {
        // Service URI
        let uri = this.platformExpressURL + `fbu/uapi/modules/${moduleId}/api`;

        // If `query` parameter is passed
        if (query !== undefined) {
            uri += `?query=${query}`;
        }

        let method_lower_cased = method.toLowerCase();

        try {
            const res = await this.execute(
                method_lower_cased,
                uri,
                request_body
            )

            return res;

        } catch (error) {

            throw new Error(`Proxy API execution of module ${moduleId} failed to process, reason: ${error}`)
        }

    }

    /**
     * Get Module Components (For Front-End Modules)
     * 
     * Note: This might not work for Remote-Execute modules.
     * @param {String} moduleId 
     * @param {String} locale Default to en-US 
     * 
     * Example
     * ```js
     *  const moduleComponents = await unqorkInstance.getModuleComponents("MODULE_ID");
     * 
     * // Do further process on those components
     * 
     * 
     * // end of example
     * ```
     * 
     * Sample Response Schema
     * ```json
     * {
     *   "components": [
     *          {}
     *   ]
     * }
     * 
     * ```
     * 
     * @returns {Object}
     */
    getModuleComponents = async (moduleId, locale) => {

        let uri = this.platformExpressURL + `fbu/uapi/modules/${moduleId}/components`;

        if (locale) {
            uri += `?locale=${locale}`
        }

        try {
            const res = await this.execute("get", uri);

            return res;

        } catch (error) {
            throw new Error(`Error occurred while executing Get Module Components for module ${moduleId}, Reason: ${error}`)
        }
    }

    // Query Related Definitions

    /**
     * Get Rows from Reference Data
     * 
     * @description Queries a Reference Data table and returns the results of the query. 
     * The query string should be used to specify fields, filter conditions, and sorting, 
     * according to the api-query-params library. For example, /fbu/uapi/query/people/all?age=33 
     * will result in [{"name":"Alice","age":33},{"name":"Bob","age":33}]. 
     * NOTE: If no filter condition is passed, the default limit is 100 
     * (this can be overridden by passing the limit parameter). If a filter condition is passed, 
     * all results will be returned (unless a limit is passed)
     * 
     * @param {String} table Required
     * @param {String} filter Optional Filter Query Pass "none" if no parameter needs to be passed
     * @param {Number} limit Optional Default = 100
     * 
     * Example 
     * ```
     * const rows = await UnqorkInstance.getRowsFromTable("countries", "language=en", 20 )
     * 
     * ```
     * 
     * * 
     * Sample Response
     * 
     * ```
     * [
     *  { _id: '5ff54d7b0cb61e024533d235', countryName: 'Austria' },
     *  { _id: '5ff54d7b0cb61e024533d2ae', countryName: 'New Zealand' },
     *  { _id: '5ff54d7b0cb61e024533d2bc', countryName: 'Peru' },
     *  { _id: '5ff54d7b0cb61e024533d24a', countryName: 'Cameroon' },
     *  { _id: '5ff54d7b0cb61e024533d2a0', countryName: 'Mauritania' },
     *  { _id: '5ff54d7b0cb61e024533d251', countryName: 'Colombia' },
     *  { _id: '5ff54d7b0cb61e024533d258', countryName: 'Cuba' },
     *  { _id: '5ff54d7b0cb61e024533d277', countryName: 'Haiti' }
     *  ]
     * ```
     * 
     * @returns {Array} rows
     * 
     */
    getRowsFromTable = async (table, filter, limit) => {
        let uri = this.platformExpressURL + `fbu/uapi/query/${table}/all`;
        if (filter !== "none" && filter !== null && filter !== "") {
            uri += `?${filter}`
        }
        if (limit > 0 && limit !== undefined && limit !== null) {
            if (filter !== "none" && filter !== null && filter !== "") {
                uri += `&limit=${limit}`
            } else {
                uri += `?limit=${limit}`
            }
        }

        // console.log(uri);

        try {
            const rows = await this.execute("get", uri);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching rows from ${table} data reference table, reason: ${error}`);
        }
    }

    /**
     * Get Distinct Values from Reference Data
     * 
     * @description Queries a Reference Data table and returns the distinct list of values from a single field. The query string should be used to specify fields, 
     * filter conditions, and sorting, according to the api-query-params library. For example, /fbu/uapi/query/people/distinct?distinct=name&age=33 will result in 
     * [{"name":"Alice"},{"name":"Bob"}].
     * 
     * @param {String} table Required
     * @param {String} distinctField Required
     * @param {String} filter Optional --> Pass nothing, null or "" for no filter
     * 
     * Example
     * ```js
     * const rows = await UnqorkInstance.getDistinctValuesFromTable("customers", "age", "age<=18");
     * 
     * ```
     * 
     * Sample Response
     * 
     * ```
     * [
     *  {countryName: 'Austria' },
     *  {countryName: 'New Zealand' },
     *  {countryName: 'Peru' },
     *  {countryName: 'Cameroon' },
     *  {countryName: 'Mauritania' },
     *  {countryName: 'Colombia' },
     *  {countryName: 'Cuba' },
     *  {countryName: 'Haiti' }
     *  ... 104 more records
     *  ]
     * ```
     * 
     * @returns {Array} Array of rows
     */
    getDistinctValuesFromTable = async (table, distinctField, filter) => {
        let uri = this.platformExpressURL + `fbu/uapi/query/${table}/distinct?distinct=${distinctField}`;

        if (filter !== null && filter !== undefined && filter !== "" && filter !== "none") {
            uri += `?${filter}`
        }

        try {
            const rows = await this.execute("get", uri);
            return rows;

        } catch (error) {

            throw new Error(`Error fetching distinct values from ${table} data reference table, reason: ${error}`)

        }
    }

    // Submissions Related Definitions

    /**
     * Get module submissions
     * 
     * @description Returns module submission objects for a given module. This is a paged endpoint (see Paging). Module submission data is transformed and returned in a specific format, 
     * based on the specified transform. JSON submission data is returned as an object, XML data is returned as a string, and PDF data is returned as a Cloud Storage Delivery URL to 
     * the rendered PDF (and optionally base 64 data).
     * 
     * @param {String} moduleId Required
     * @param {String} queryParams Optional Query parameters (See Unqork Docs for Reference)
     * 
     * ```js
     *  // Sample Execution
     *  const submissions = await UnqorkInstance.getModuleSubmissions("moduleId", "?filter=age>18;age<60")
     * ```
     * 
     * @returns {Array} Array of schema submission in unqork module
     */
    getModuleSubmissions = async (moduleId, queryParams) => {

        let uri = this.platformExpressURL + `fbu/uapi/modules/${moduleId}/submissions`;

        if (queryParams !== undefined && queryParams !== null && queryParams !== "") {
            uri += queryParams
        }

        try {
            const response = await this.execute("get", uri);
            return response;
        } catch (error) {
            throw new Error(`Error fetching module submissions for module ${moduleId}, endpoint: ${uri}, reason: ${error}`);
        }

    }

    /**
     * Get workflow submissions
     * 
     * @description Returns workflow submission objects for a given workflow. This is a paged endpoint (see Paging). Workflow submission data is transformed and returned in a specific format, 
     * based on the specified transform. JSON submission data is returned as an object, XML data is returned as a string, and PDF data is returned as a Cloud Storage Delivery URL to 
     * the rendered PDF (and optionally base 64 data).
     * 
     * @param {String} workflowId Required
     * @param {String} queryParams Optional Query parameters (See Unqork Docs for Reference)
     * 
     * ```js
     *  // Sample Execution
     *  const submissions = await UnqorkInstance.getWorkflowSubmissions("workflowId", "?filter=age>18;age<60")
     * ```
     * 
     * @returns {Array} Array of schema submission in unqork workflow
     */
    getWorkflowSubmissions = async (workflowId, queryParams) => {

        let uri = this.platformExpressURL + `fbu/uapi/workflows/${workflowId}/submissions`;

        if (queryParams !== undefined && queryParams !== null && queryParams !== "") {
            uri += queryParams
        }

        try {
            const response = await this.execute("get", uri);
            return response;
        } catch (error) {
            throw new Error(`Error fetching workflow submissions for workflow ${workflowId}, endpoint: ${uri}, reason: ${error}`);
        }

    }

    /**
     * List submissions for Dashboard
     * 
     * @description Lists Submissions of a particular module (or multiple modules), based on the requesting user's role and group membership, for population of a Dashboard. Supported features:
     * Specify specific submission data/metadata fields to include in the query result
     * Specify filter conditions based on specific submission data/metadata values
     * Specify sort order based on data fields.
     * Submission data filter conditions, sort, skip, and limit must be specified according to the api-query-params library.
     * Example: /fbu/uapi/system/getSubmissions?moduleId=<module1>&moduleId=<module2>&fields=name,age&age=33
     * 
     * @param {String} { moduleId or workflowId } Required
     * @param {String} queryParams Optional Query Filter (See Unqork Docs for reference)
     * 
     * ```js
     *  // Example Execution
     *  const submissionsForDashboard = await UnqorkInstance.listSubmissionsDashboard("moduleId", "?fields=name,country,age");
     * 
     *  // Run Dashboard Render or Analytics
     * 
     * ```
     * 
     * @returns {Array} Array of submissions for dashboards
     */
    listSubmissionsDashboard = async (moduleId, queryParams) => {

        let uri = this.platformExpressURL + `fbu/uapi/system/getSubmissions?moduleId=${moduleId}`;

        if (queryParams !== undefined && queryParams !== null && queryParams !== "") {
            uri += `&${qu}`
        }

        console.log(uri);

        try {
            const response = await this.execute("get", uri);
            return response;

        } catch (error) {
            throw new Error(`Error occurred while fetching the schema submissions for dashboard for ${moduleId}, URI: ${uri}, Reason: ${error}`);
        }

    }

    /**
     * 
     * @param {String} schemaType - The type of schema either 'module' or 'workflow'
     * @param {*} schemaId - Schema Module Id or Workflow Id
     * @param {*} submissionId - Submission Id we need to fetch
     * @param {*} queryParams - optional query parameters (See Unqork Docs for reference)
     * 
     * ```js
     *      // Example Execution
     *      const submissionData = await UnqorkInstance.getSubmission("workflow", "WORKFLOWID", "SUBMISSIONID")
     * ```
     * 
     * ```
     * // Sample Response Object
     * {
     * id: '676d242332a19c05d131878c',
     * moduleId: '676d0ab132a19c05d1306665',
     * userId: 'tester.testing@aidenai.com',
     * created: '2024-12-26T09:38:43.940Z',
     * modified: '2024-12-26T09:38:43.941Z',
     * data: {
     *   rawData: {
     *     taskId: 'T-2',
     *     taskName: 'AT 01',
     *     taskInitiatedOn: '2024-12-26',
     *     taskAssignedTo: 'Test',
     *     taskPriority: 'High',
     *     taskStatus: 'New',
     *     assignedEmail: 'tester.testing@unqork.com'
     *   }
     * },
     * metadata: {},
     * validationErrors: [],
     * platformVersionAtCreated: '7.14.2.0',
     * moduleArchiveIdAtCreated: '676d0acb08f3f4cc88beaf7c'
     * }
     * 
     * ```
     * 
     * @returns {Object} Object- Response (Data) of the module/ workflow submission
     */
    getSubmission = async (schemaType, schemaId, submissionId, queryParams) => {

        let uri = this.platformExpressURL + 'fbu/uapi/';

        if (schemaType === "module") {
            uri += `modules/${schemaId}/submissions/${submissionId}`;

        } else if (schemaType === "workflow") {
            uri += `workflows/${schemaId}/submissions/${submissionId}`
        } else {
            throw new Error(`Invalid ${schemaType} schema type it can be either 'module' or 'workflow'`);
        }

        if (queryParams !== undefined && queryParams !== null && queryParams !== "") {
            uri += `?${queryParams}`
        }

        try {
            const response = await this.execute("get", uri);
            return response;

        } catch (error) {
            throw new Error(`Error fetching the module submission of ${moduleId} using URL: ${uri}, reason: ${error}`)
        }

    }

    /**
     * Create Module Submission
     * 
     * @description Creates one or more new module submission. Submission ID is auto-generated and returned. 
     * Module submission data must be provided as a JSON object. In case of multiple submissions, 
     * Request Body must contain an Array of below defined request body structure. Max Limit per request is 50.
     * 
     * @param {String} moduleId Required Module Id
     * @param {Object} requestBody Required Request Body
     * @param {String} transformName Optional transform name
     * 
     * ```js
     *  const savedFormData = await UnqorkInstance.createModuleSubmission(
     *          "MODULEID", 
     *          {
     *              data: {
     *                  "name": "John Doe",
     *                  "email": "john_doe@unqork.com",
     *                  "dob": "1990-01-01"    
     *              }
     *          })
     * ```
     * Response Sample
     * 
     * ```
     * Response Schema
     * {
     *     "userId": "string",
     *     "data": {},
     *     "metadata": {}
     * }
     * ```
     * 
     * @returns {Object} Object Response
     */
    createModuleSubmission = async (moduleId, requestBody, transformName) => {
        let uri = this.platformExpressURL + `fbu/uapi/modules/${moduleId}/submissions`;

        if (transformName !== undefined && transformName !== null && transformName !== "") {
            uri += `?transformName=${transformName}`
        }

        if (typeof requestBody !== "object") {
            throw new Error(`Invalid request body, please pass JSON Object`);
        }

        try {
            const response = await this.execute("post", uri, requestBody);

            return response;

        } catch (error) {

        }

    }

    /**
     * Restore Module or Workflow Submission after delete
     * @description Restore a soft-deleted module or workflow submission
     * 
     * @param {String} schemaType - Can be either "module" or "workflow" 
     * @param {String} schemaId  - Module or Workflow Id
     * @param {String} submissionId - Submission Id to be restored
     * 
     * Sample Execution
     * ```js
     *      const restoreAccount = await UnqorkInstance.restoreSubmission("module", "SUBMISSSION_SCHEMA_MODULE_ID", "SUBMISSION_ID");
     *      
     *      if(restoredAccount){
     *          alert("Account details has been restored successfully!")
     *      }
     *      
     * 
     * ```
     * 
     * @returns {Boolean} true or false if submission is restored or not
     */
    restoreSubmission = async (schemaType, schemaId, submissionId) => {
        let uri = this.platformExpressURL + `fbu/uapi/`;
        if (schemaType === "module") {
            uri += `modules/${schemaId}/submissions/${submissionId}/restore`;
        } else if (schemaType === "workflow") {
            uri += `workflows/${schemaId}/submissions/${submissionId}/restore`;
        } else {
            // throw new Error(`Invalid Schema Type ${schemaType}, it can only be either "module" or "workflow"`)
            return false;
        }

        try {
            const restoredResponse = await this.execute("post", uri);
            return true;
        } catch (error) {
            return false;
            // throw new Error(`Action to restore submission from ${schemaType} failed due to ${error}`);
        }

    }

    /**
     * Update Module or Workflow Submission
     * 
     * @description _*MODULE SUBMISSION*_ Updates multiple module submissions. This operation supports partial "data" updates, 
     * i.e. data that is sent in "data" may include some but not all of the submission data. Partial metadata 
     * updates are supported without including the entire metadata object. To increment a numeric data key 
     * (will also initialize), use "incrementData" To delete a data key, use "unsetData". To delete a metadata key, 
     * use "unsetMetadata". To replace the entire data object, use the "replaceData" flag. Module submission data must 
     * be provided as a JSON object. Max Limit per request is 50.
     * 
     * _*WORKFLOW SUBMISSION*_ This endpoint is available to "Administrator" users only. Updates a single workflow submission based on 
     * submission ID and, if passed, dataFilter and metadataFilter. This operation supports partial "data" updates, i.e. data that is sent 
     * in "data" may include some but not all of the submission data. Update of the owner/user is supported through "userId". 
     * Update of current status is supported through "currentStatus". Partial metadata updates are supported without including the entire metadata object. 
     * To increment a numeric data key (will also initialize), use "incrementData" To delete a data key, use "unsetData". To delete a metadata key, use "unsetMetadata". 
     * Workflow submission data must be provided as a JSON object.
     * 
     * @param {String} schemaType   Either "module" or "workflow"
     * @param {String} schemaId     ModuleId or Workflow Id
     * @param {String} submissionId Submission Id for Module or Workflow
     * @param {Object} requestBody  Request Body to Update
     * @param {Boolean} replaceData Defaulted as false Optional Field
     * 
     * Sample Execution
     * ```js
     * // Sample Function Call
     *  const updatedResponse = await UnqorkInstance.updateSubmission("module", "SCHEMA_MODULE_OR_WORKFLOW_ID", "SUBMISSION_ID", {data:{}}, false)
     *  
     *  ```
     * 
     * Response Schema
     * ```
     * [
     *   {
     *       "id": "string",
     *       "status": 0,
     *       "message": "string"
     *   }
     *  ]
     * 
     * ```
     * @returns 
     */
    updateSubmission = async (schemaType, schemaId, submissionId, requestBody, replaceData) => {

        let uri = this.platformExpressURL + `fbu/uapi/`;

        if (schemaType === "module") {
            uri += `modules/${schemaId}/submissions/${submissionId}`;
        } else if (schemaType === "workflow") {
            uri += `workflows/${schemaId}/submissions/${submissionId}`;
        } else {
            throw new Error(`Invalid Schema Type: ${schemaType} it can be either "module" or "workflow"`);
        }

        if (replaceData) {
            uri += `?replaceData=${replaceData}`;
        }

        try {
            const response = await this.execute("put", uri, requestBody);

            return response;

        } catch (error) {

            throw new Error(`Error executing the update of ${schemaType} submission, please check the parameters again.`);

        }

    }

    /**
     * Delete Multiple Module or Workflow Submission(s)
     * @description 
     * Workflow: Deletes multiple workflow submissions based on the ID(s) supplied. 
     * Note that workflow submissions are soft-deleted (marked deleted, but not removed). 
     * Default Max Limit per request is 50
     * 
     * Module: Deletes multiple module submission based on the ID supplied. 
     * Note that module submissions are soft-deleted (marked deleted, but not removed). 
     * Default Max Limit per request is 50
     * 
     * 
     * @param {String} schemaType Either "module" or "workflow"
     * @param {String} schemaId  Schema Module Id or Workflow Id
     * @param {String} submissionIds  Submission Ids (Comma separated list) for Module or Workflow
     * @param {Boolean} isHardDelete  Optional Boolean value to hard delete a submission or soft delete (Default soft-delete i.e. false)
     * 
     * ```js
     *      const areSubmissionsDeleted = await UnqorkInstance.deleteSubmissions("module", "MODULE_OR_WORKFLOW_ID", "SUBMISSION_ID_1,SUBMISSION_ID_2..");
     *      if(areSubmissionsDeleted){
     *          alert("Submissions are removed!");
     *      }
     * ```
     * 
     * 
     * @returns {Boolean} true or false if the submission(s) are deleted or not
     */
    deleteSubmissions = async (schemaType, schemaId, submissionIds, isHardDelete) => {
        let uri = this.platformExpressURL + `fbu/uapi/`;

        if (submissionIds === undefined || submissionIds === null || submissionIds === "") {
            throw new Error("Please pass a proper submissionId(s) to be deleted.");
        }

        if (!isHardDelete || isHardDelete === undefined || isHardDelete === null || isHardDelete === "") {
            isHardDelete = false;
        }

        if (schemaType === "module") {
            uri += `modules/${schemaId}/submissions?ids=${submissionIds}&destroy=${isHardDelete}`
        } else if (schemaType === "workflow") {
            uri += `workflows/${schemaId}/submissions?ids=${submissionIds}&destroy=${isHardDelete}`
        } else {
            throw new Error(`Invalid Schema Type ${schemaType}, it can be either "module" or "workflow"`);
        }

        try {
            const response = await this.execute("delete", uri);

            if (response) {
                return true
            } else {
                return false
            }

        } catch (error) {
            return false;
            // throw new Error(`Error deleting submission(s), please check the params, URI: ${uri}, reason: ${error}`)
        }
    }

    // Workflow Related Definitions

    /**
     * Create Workflow Submission
     * 
     * @description Creates a new workflow submission. Submission ID is auto-generated and returned. 
     * Workflow submission data must be provided as a JSON object. The default start node will be used.
     * 
     * @param {String} workflowPath Workflow Path
     * @param {Object} requestBody Request body object
     * 
     * ```js
     *      // Sample Execution or Triggering of workflow
     *      const response = await UnqorkInstance.createWorkflowSubmission("my-workflow-path", {data:{}})
     * 
     * ```
     * 
     * @returns 
     */
    createWorkflowSubmission = async (workflowPath, requestBody) => {
        let uri = this.platformExpressURL + `fbu/uapi/workflow-execute/${workflowPath}`;

        if(requestBody === undefined || requestBody === null || requestBody === ""){
            requestBody = {}
        }

        try{
            const response = await this.execute("post", uri, requestBody);

            return response;

        }catch(error){
            throw new Error(`Error creating workfow submission for ${workflowPath}, reason: ${error}`);
        }

    }



}

export default Unqork;