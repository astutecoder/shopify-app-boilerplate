# Welcome!

This boilerplate is created to describe the authentication and authorization process for shopify app. This project follows procedural way, so kindly overlook the coding standard :)

### Prerequisites

Before starting, make sure you have the following:

- Node.js installed
- Shopify Partner account

### Installation

_Client & Server_

1. Clone this repository to your local machine.
2. Create a `.env` file and populate it with keys from the `.env-sample` file.

### Getting Started

1. Run the client and server using the following command:

   ```
   yarn run dev
   ```

2. Open your Shopify Partner account and navigate to the App setup section.

3. Add the App URL, using your client project's link, as the main URL.

4. Set the redirection URLs

   - `{CLIENT_PROJECT_HOST}/authenticate`

5. Install the app in your demo store.

### Note:

- if you uninstall the app from shopify admin, don't forget to remove store related data from you database.
- this project will not be maintained in future.

---

_I have created another boilerplate. You can check that [here](https://github.com/astutecoder/shopify-react-node)_

For any issues or queries, feel free to contact our support team.
