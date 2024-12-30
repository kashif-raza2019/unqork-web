# unqork-web

Unqork web, is an unofficial integration support with Unqork Internal Services via NodeJS or any Node JS Wrapper technology stack.
It provides an easier error free integration with unqork for any environment possible.

## Status
[![Publish to npm](https://github.com/kashif-raza2019/unqork-web/actions/workflows/npm-publish-manual.yml/badge.svg)](https://github.com/kashif-raza2019/unqork-web/actions/workflows/npm-publish-manual.yml)

## How to Install?

`npm install unqork-web`

### Install the latest version

`npm install unqork-web@latest`


> The current version of the package does not provide access anonymously to any environment, you should have access as an
> express user for accessing the basic features of unqork.
> Also, We suggest to save the client credentials for your unqork environment in environment variables for more security.

### Dependencies
- Unqork Web Package is dependent on *__axios__* __version >=1.7.9__
- Unqork Platform and environment version.

## How to use?

- After installing the package >> Get your username (or client_id) and password (or client_secret) for accessing the environment.
- import the package in your module of choice (you may use the below snippet)

```js
const Unqork = require("unqork-web");
// Or import Unqork from "unqork-web";
```

- Then create the Unqork instance we need to connect with, here we will need three mandatory parameters for initializing the instance
  The environment property value in the below snippet would be the part of url as `https://${environment}.unqork.io`
  for example: *https://test.unqork.io* would be having environment as _**test**_

```js
const myUnqorkInstance = new Unqork({
  environment: "test",
  client_id: process.env.UNQORK_CLIENT_ID,
  client_secret: process.env.UNQORK_CLIENT_SECRET,
  isAuthenticated: true, // Default (Not required to be passed)
});
```

- The first action that we can perform is to actually connect our system with unqork using `connect()` method
  `myUnqorkInstance.connect()`
  Example

```js

    const saveFormDataOnUnqork = async (formSubmissionData) => {
        try{
            const connection = await myUnqorkInstance.connect();
            if(connection){
                const response = await myUnqorkInstance.createModuleSubmission(
                    "<MODULE_ID>",
                    formSubmissionData,
                    false
                )
                console.log(response.id);
            }
        }catch(error){
            console.log(error);
            alert(error);
        }

    }

    /**
     * connect() method response below:
     *  Returns 1 --> If Successfully connected
     *  Returns 2 --> If establishing connection
     *  Returns 0 --> Connection/ Authentication failed
     * /
```
### List of express services
For More Information read Unqork API Documentation: [developers.unqork.io](https://developers.unqork.io/), you may also see the functions provided by Unqork Instance in this package.

| Service | Unqork Service API URL | Unqork-Web Function |
|:--------|:-----------------------|:--------------------|
| Execute Unqork Module | *```/fbu/uapi/modules/{moduleId}/execute```* | *executeModule(__moduleId__, __requestBody__)* |
| Execute via Proxy (GET/POST/PUT/PATCH/DELETE) | *```/fbu/uapi/modules/{moduleId}/api```* | *executeViaProxy(__method__, __moduleId__, __requestBody__, __query__)* |
| Get Module Components | *```/fbu/uapi/modules/{moduleId}/components```*| *getModuleComponents(__moduleId__)* |
| Get Rows from reference table | *```/fbu/uapi/query/{table}/all```* | *getRowsFromTable(__table_name__, __filter__, __limit__ )*|

Documentation for more to be added soon...

### Are you from Unqork Engineering Team? Want to collaborate and make it official package for Unqork?!

If you are from a leadership/ engineering management or platform team from Unqork that is looking to collaborate in this package and make it market ready and officially recognized, I would be elated to extend my support as best possible. <br />
Feel Free to reach out via github: [kashif-raza2019](https://github.com/kashif-raza2019) 
Via Email: kashifraza08012001@gmail.com

### Want to collaborate as an open source contributor?
Please Go through Issues which are open via https://github.com/kashif-raza2019/unqork-web/issues

If the issue is not present which you are looking for, create a new issue with proper label (either `feature`, or `bug`)

And add at-least these below details
- __Service Type__: Whether it is an internal service already present in unqork developer docs or something completely new.
- __Endpoint__: Endpoint/ URL for the API call to be made if it is HTTP REST API call.
- __Method (If any)__: HTTP Method if any needed to be specified.
- __Link to documentation from Unqork__: Any specific link to documentation/ release notes from Unqork.
- __Request body schema__: Schema and Sample Request body of the endpoint.

> __Note__: Please refrain from adding any client specific platform/ credentials/ keys or API URLs, if needed please mask (like https://{environment}.unqork.io) it before adding it in comment(s) or description(s) as it may lead to unwanted security risk if exposed publicly.


Hope this package would be useful for your organization! <br />
Kashif
