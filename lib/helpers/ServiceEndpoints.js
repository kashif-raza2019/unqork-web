/**
 * This is container for all the service endpoints
 * for Unqork's Internal Services based upon the services 
 * present for Unqork Platform Version: 7.12.0
 * @release_notes https://docs.unqork.io/release-notes/Content/LandingPages/Landing_ReleaseNotes.htm
 * 
 */
// import { splitStringByBraces } from "./functions.js";
 
const ACCESS_TOKEN_URI = "api/1.0/oauth2/access_token"

const SERVICE_ENDPOINTS = [
    {
        uri: `/auth/login`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/auth/login/forgotPassword/start`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/auth/login/forgotPassword/verify`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/auth/login/forgotPassword/submit`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/configurationAnalysis`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/contentpdf`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/excelFill`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/fileUtils/json2zip`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/fileUtils/json2csv`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/fileUtils/decrypt/gpg`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/fileUtils/encrypt/gpg`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/components`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/image/convert`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/logs/services`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/paperIngestion/jobs`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/paperIngestion/jobs/{jobId}/status`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/paperIngestion/jobs/{jobId}/submissions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/pdfbar`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/pdfbar/combine`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/query/{table}/all`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/query/{table}/distinct`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/system/getSubmissions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/system/getIncrementalCounter`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/system/hashString`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/transformer`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/transformer/xml2js`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/unique`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/library/shareableWorkspaces`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/library/{elementType}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/library/{elementType}/tags`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/tags`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/applications`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/applications/{applicationId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/applications/{applicationId}/tags`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/applications/{applicationId}/lastEditedElementInfo`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/applications/{applicationId}/nonConnected/{elementType}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{parentId}/relationships`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/{elementType}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/sharesettings/{elementType}/{elementId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/v2/sharesettings/{elementType}/{elementId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/unshare/{elementType}/{elementId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/library/modules`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workspaces/{workspaceId}/user/{userId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/referstring`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/submissions`,
        service_name: "getModuleSubmissions",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/submissions/{submissionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/submissions/{submissionId}/revisions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/submissions/{submissionId}/revisions/{revisionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/submissions/{submissionId}/restore`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowId}/submissions/{submissionId}/revisions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowId}/submissions/{submissionId}/revisions/{revisionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowId}/submissions/{submissionId}/restore`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowPath}/timerstart`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowPath}/timedEvents/{submissionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowPath}/timerstart/{timerStartNodePath}/start`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowPath}/timerstart/{timerStartNodePath}/stop`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowPath}/timerstart/{timerStartNodePath}/run-once`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/submissions/merge/{submissionIds}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/execute`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/modules/{moduleId}/api`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowId}/submissions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflows/{workflowId}/submissions/{submissionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflow-execute/{workflowPath}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflow-execute/{workflowPath}/{stepPath}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflow-execute/{workflowPath}/resume/{resumePathName}/submission/{submissionId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/workflow/{workflowPath}/handoff`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/validateFromSchema`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/{recordId}/archive`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/archive`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/{recordId}/restore`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/restore`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/records`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/submissions`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/models/{dataModelId}/{recordId}`,
        service_name: "",
        service_type: "express"
    },
    {
        uri: `/fbu/uapi/searchConfigs/{queryId}/execute`,
        service_name: "",
        service_type: "express"
    }
]

const AVAILABLE_PROXY_METHODS=['get', 'post', 'put', 'patch', 'delete']

module.exports = {
    ACCESS_TOKEN_URI,
    SERVICE_ENDPOINTS,
    AVAILABLE_PROXY_METHODS
}