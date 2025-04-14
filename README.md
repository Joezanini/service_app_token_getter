# Webex Service App Token Getter

## Overview
This application is a Webex Integration that is intended to be used by a developer that manages and owns a Webex Service App.
![](./images/serviceapptokengetter.svg)
The above diagram outlines a high-level overview of the intended use case for this application. It is a companion app to a
Webex Service App that is owned, hosted and used by the Webex Developer.

This Node.js server is designed to handle OAuth flows from a Webex Integration, create webhooks for Webex events, and manage token exchanges and refreshes.
The server listens for HTTP requests and processes them to handle authorization and token management.

Watch this [Vidcast](https://app.vidcast.io/share/839a6f46-1774-4bc1-b342-8c0df74ecfb3) for a demo on getting started!

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12.x or higher)
- [npm](https://www.npmjs.com/get-npm)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Webex Integration](https://developer.webex.com/docs/integrations)
- [Webex Service App](https://developer.webex.com/docs/service-apps)

The above Integration and Service App Credentials can be plugged into the respective environment variable
in .env.example.

The Integration needs to be registered with scopes spark:all, spark:applications_token, application:webhooks_write, and application:webhooks_read selected for
registering [Webex webhooks](https://developer.webex.com/docs/api/v1/webhooks).

The Service App needs to be scoped according to the permissions and licenses of the org in use. For testing
please request a developer sandbox [here](https://developer.webex.com/docs/developer-sandbox-guide). Use the
administrator for the sandbox as a developer for testing.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/Joezanini/service_app_token_getter.git
    cd service_app_token_getter
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Environment Variables**:
   Rename `.env.example` to `.env` file in the root of your project and add the following environment variables:
    ```env
    INT_CLIENTID = 'developer integration client id'
    INT_CIENTSECRET = 'developer integration client secret'
    SA_CLIENTID = 'sevice app client id'
    SA_CLIENTSECRET = 'service app client secret'
    INT_ACCESSTOKEN = ''
    INT_REFRESHTOKEN = ''
    TOKEN_ENDPOINT = 'https://webexapis.com/v1/access_token'
    TARGET_URL = 'https://mywebhookurl.com/webhook'
    ```
    **make sure that the TARGET_URL has the /webhook appended as the server is listening at that endpoint**

## Usage

1. **Start the server**:
    ```sh
    node server.js
    ```

2. **Access the application**:
   Open your web browser and navigate to the integration registration page and retrieve the authorization url from the black box on the form.
   ![Authorization URL](./images/authurl.png)
    Open a new tab incognito and paste the authorization url into the browser and authorize the integration using the developer that registered the integration credentials. This will redirect to the redirect url specified for example `http://localhost:3000/redirect`.

3. **Endpoints**:
   - `POST /webhook`: Endpoint to handle webhook events.
   - `GET /redirect`: Endpoint to handle redirection and exchange code for tokens during the OAuth flow.

   The webhooks need https enabled to listen for events. To test locally, use [ngrok](https://ngrok.com/)
   or [Pinggy](https://pinggy.io/) to tunnle to `/webhook` endpoints. Make sure to append the `/webhook`
   when using the url produced by these apps to populate the `target_url` `.env` variable in `.env.example`.

## Code Overview

### Dependencies

- `http`: Node.js core module to create an HTTP server.
- `axios`: Promise-based HTTP client for the browser and Node.js.
- `base64url`: Module for base64 encoding and decoding without `=` padding.
- `url`: Node.js core module to parse URL strings.
- `dotenv`: Module to load environment variables from a `.env` file.

### Functions

- **exchangeCodeForTokens**: Exchanges authorization code for access and refresh tokens.
- **refreshTokens**: Refreshes the access token using the refresh token.
- **generateApplicationId**: Generates application ID based on the client ID.
- **getOrgId**: Decodes the organization ID from a base64-encoded value.
- **createServiceAppAuthorizedWebhook**: Creates a webhook for the service app authorized event.
- **createServiceAppDeauthorizedWebhook**: Creates a webhook for the service app deauthorized event.

### Server

The server listens on the port specified in the environment variables or defaults to port 3000. It handles the following endpoints:

- **/webhook (POST)**: Processes webhook events, primarily focusing on the `authorized` and `deauthorized` events.
- **/redirect (GET)**: Handles OAuth redirection and token exchange.

### Example `.env` file

```env
PORT=3000
INT_CLIENTID=your_integration_client_id
INT_CLIENTSECRET=your_integration_client_secret
SA_CLIENTID=your_service_app_client_id
SA_CLIENTSECRET=your_service_app_client_secret
TOKEN_ENDPOINT=https://your-token-endpoint
TARGET_URL=https://your-target-url // ngrok or pinggy url
```

## Troubleshooting
if you mess up and need to remove the webhook from the integration you can get the webhook id from the console log and run a delete request to the Webex DELETE A Webexhook [endpoint](https://developer.webex.com/docs/api/v1/webhooks/delete-a-webhook) using the Try It feature on the developer portal. If you need an alternate way to get a webhook id you can use the LIST webhooks [endpoint](https://developer.webex.com/docs/api/v1/webhooks/list-webhooks) to get a list of webhooks for the integration and find the webhook id.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

