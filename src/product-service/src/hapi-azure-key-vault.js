const KeyVault = require("azure-keyvault");
const Joi = require("joi");
const AuthenticationContext = require("adal-node").AuthenticationContext;

const optionsValidation = Joi.object({
  id: Joi.string(),
  secret: Joi.string(),
  uri: Joi.string()
});

const plugin = {
  pkg: {
    version: "1.0.0",
    name: "hapi-azure-key-vault"
  },
  async register(server, pluginOptions) {
    const { id, secret, uri } = await optionsValidation.validate(pluginOptions);

    const authenticator = function(challenge, callback) {
      // Create a new authentication context.
      const context = new AuthenticationContext(challenge.authorization);

      // Use the context to acquire an authentication token.
      return context.acquireTokenWithClientCredentials(
        challenge.resource,
        id,
        secret,
        function(err, tokenResponse) {
          if (err) throw err;
          // Calculate the value to be set in the request's Authorization header and resume the call.
          const authorizationValue =
            tokenResponse.tokenType + " " + tokenResponse.accessToken;

          return callback(null, authorizationValue);
        }
      );
    };

    const credentials = new KeyVault.KeyVaultCredentials(authenticator);
    const client = new KeyVault.KeyVaultClient(credentials);

    const expose = {
      get: client.getSecret.bind(client, uri),
      set: client.setSecret.bind(client, uri)
    };

    server.decorate("server", "keyvault", expose);
    server.decorate("request", "keyvault", expose);
  }
};

module.exports = plugin;
