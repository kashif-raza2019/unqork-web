/**
 * Unqork Class Instance
 * 
 */

import axios from "axios";
import { ACCESS_TOKEN_URI } from "../helpers/ServiceEndpoints.js";


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
        // Boolean false by default indicates if we need to connect to unqork as soon 
        // as the instance is initialized
        connectByDefault
    }) {
        this.environment = environment;
        this.client_id = client_id;
        this.client_secret = client_secret;

        // Desginer URL
        this.platformDesignerURL = `https://${this.environment}.unqork.io/`;

        //Express URL
        this.platformExpressURL = `https://${this.environment}x.unqork.io/`;

        // Boolean indicates if the server is authenticated
        this.isConnected = false;
        
        if (connectByDefault === true) {
            this.connect();
        }
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
                this.isConnected = true;
                return 1;
            }
            return 2;
        } catch (error) {
            console.log(error);
            return 0;

        }

    }

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

        let uri = this.platformExpressURL + `fbu/uapi/modules/${moduleId}/execute`;
        try {

            const response = await axios.put(
                uri,
                request_body,
                {
                    headers: {
                        Authorization: `Bearer ${this.access_token}`
                    }
                }
            );

            return response.data;

        } catch (error) {
            return {
                error: error,
                service: "Module Execute"
            }
        }

    }


}



export default Unqork;