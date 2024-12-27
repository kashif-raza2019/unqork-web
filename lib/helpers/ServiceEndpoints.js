/**
 * This is container for all the service endpoints
 * for Unqork's Internal Services based upon the services 
 * present for Unqork Platform Version: 7.12.0
 * @release_notes https://docs.unqork.io/release-notes/Content/LandingPages/Landing_ReleaseNotes.htm
 * 
 */
const ACCESS_TOKEN_URI = "api/1.0/oauth2/access_token"

const EXPRESS_SERVICE_ENDPOINTS = [
    {
        name: "",
        description: "",
        endpoint: "",
        method: "",
        params: [
            "format",
            "appId",
            "moduleId",
            "checkType",
            "checkName",
            "resultType",
            "limit",
            "default"
        ]
    }
];

const DESIGNER_SERVICE_ENDPOINTS = [
    {

    }
]

module.exports = {
    ACCESS_TOKEN_URI,
    EXPRESS_SERVICE_ENDPOINTS,
    DESIGNER_SERVICE_ENDPOINTS
}