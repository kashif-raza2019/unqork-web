'use strict';

/**
 * Create Unqork Instance
 * @param {Object} unqorkEnvironmentConfig The config for the unqork environment
 * @return {Unqork} New unqork's instance with functionalities.
 * 
 */
class Unqork {

    constructor(unqorkEnvironmentConfig){
        this.env = unqorkEnvironmentConfig.environment;
        this.client_id = unqorkEnvironmentConfig.clientId;
        this.client_secret = unqorkEnvironmentConfig.clientSecret;
    }

}