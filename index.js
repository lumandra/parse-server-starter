const express = require("express");
const { ParseServer } = require("parse-server");
const ParseDashboard = require("parse-dashboard");
const muralAuthAdapter = require('parse-server-mural-auth-adapter');
const request = require("request");
const http = require("http");
const path = require("path");
const write = require('write');
const fs = require("fs");
require("dotenv").config();
const bodyParser = require("body-parser");
const packageJSON = require("./package.json");

const config = require("./config.json");
let parseConfig = config.parseConfig;

/* Main Parse Server Config */

const PORT = process.env.PORT || parseConfig.port;
const SERVER_URL = process.env.SERVER_URL || parseConfig.URLserver;
// const GRAPHQL_SERVER =
//   process.env.GRAPHQL_SERVER_URL || parseConfig.GraphQLURLserver;
const URL_DB =
  process.env.DATABASE_URI || process.env.MONGODB_URI || parseConfig.URLdb;
const APP_ID = process.env.APP_ID || parseConfig.appId;
const MAX_UPLOAD_SIZE =
  process.env.MAX_UPLOAD_SIZE || parseConfig.maxUploadSize;
const MASTER_KEY = process.env.MASTER_KEY || parseConfig.masterKey;

/* PARSE DASHBOARD CONFIG */
/* Parse dashboard should be disabled in production unless required for specific data access requirements */
const DASHBOARD_ACTIVATED =
  process.env.DASHBOARD_ACTIVATED || config.extraConfig.dashboardActivated;
const DASH_USER_EMAIL = process.env.USER_EMAIL || config.extraConfig.userEmail;
const DASH_USER_PASSWORD =
  process.env.USER_PASS || config.extraConfig.userPassword;

/* EMAIL SYSTEM CONFIG */
const VERIFY_USER_EMAIL =
  process.env.VERIFY_USER_EMAIL || parseConfig.verifyUserEmails;
const PREVENT_LOGIN_WITH_UNVERIFIED_EMAIL =
  process.env.PREVENT_LOGIN_WITH_UNVERIFIED_EMAIL ||
  parseConfig.preventLoginWithUnverifiedEmail;

/* Complet the email adapter configuration */
// let emailOptions = parseConfig.emailAdapter.options;
// emailOptions.fromAddress  = process.env.FROM_ADDRESS    || emailOptions.fromAddress;
// emailOptions.domain       = process.env.MAILGUN_DOMAIN  || emailOptions.domain;
// emailOptions.apiKey       = process.env.MAILGUN_API_KEY || emailOptions.apiKey;

const app = new express();

if (process.env.REQUEST_LIMIT) {
    app.use(bodyParser.json({limit: process.env.REQUEST_LIMIT}));
    app.use(bodyParser.urlencoded({limit: process.env.REQUEST_LIMIT, extended: true}));
}

app.post('/users_code', bodyParser.json(), async (req, res, next) => {
  if (req.headers['x-parse-application-id'] == APP_ID && req.headers['x-parse-rest-api-key'] == MASTER_KEY)
  {
    try{
      write.sync("./cloud/users_code.js", req.body.custom_code)
    }catch(e){
      console.log(e)
    }
    res.send({ status: 'SUCCESS' })
  }
  else
    res.status(401).send({message: "Unauthorized"})
})

const checkUsersCode = async() => {
  try {
    const SERVER_URL = process.env.SERVER_URL;
    const parse_id = SERVER_URL.match(/https:\/\/(\d*).*/)[1]
    var file = fs.statSync('./cloud/users_code.js');
    const url = process.env.CUSTOM_CODE_URL || 'https://getforge.com/cloud66-webhook';
    if (file.size == 0){
      request.post({headers: {'content-type': 'application/json'},
        url: url, body: `{"service": {"name": "parse-${parse_id }"}}`})
    }
  }
  catch (e) {
    console.log(e)
  }
};

Object.assign(parseConfig, {
  appId: APP_ID,
  masterKey: MASTER_KEY,
  cloud: "./cloud/main",
  databaseURI: URL_DB,
  maxUploadSize: MAX_UPLOAD_SIZE,
  verifyUserEmails: JSON.parse(VERIFY_USER_EMAIL),
  preventLoginWithUnverifiedEmail: JSON.parse(
    PREVENT_LOGIN_WITH_UNVERIFIED_EMAIL
  ),
  serverURL: SERVER_URL,
  publicServerURL: SERVER_URL,
  auth: {
    mural: {
      module: muralAuthAdapter,
    },
  },
});

const parseServer = new ParseServer(parseConfig);

/* GraphQL Server Setup */
// const parseGraphQLServer = new ParseGraphQLServer(
//   parseServer,
//   {graphQLPath: '/graphql'}
// );

/* Uncomment to enable GraphQL */
// parseGraphQLServer.applyGraphQL(app);

/* Parse Dashboard Config */
if (DASHBOARD_ACTIVATED) {
  const dashboardConfig = {
    apps: [
      {
        serverURL: SERVER_URL,
        // graphQLServerURL: GRAPHQL_SERVER,
        appId: APP_ID,
        masterKey: MASTER_KEY,
        appName: parseConfig.appName,
      },
    ],
    trustProxy: 1,
    cookieSessionSecret: "VRManager",
    allowInsecureHTTP: 1,
  };

  if (DASH_USER_EMAIL && DASH_USER_PASSWORD)
    dashboardConfig.users = [
      {
        user: DASH_USER_EMAIL,
        pass: DASH_USER_PASSWORD,
      },
    ];

  module.exports.dashboardConfig = dashboardConfig;
  const dashboard = new ParseDashboard(dashboardConfig, {
    allowInsecureHTTP: true,
  });
  app.use("/dashboard", dashboard);
}

const postStart = async () => {
  await parseServer.start();
};

// Serve the Parse API on the /parse URL prefix
app.use("/parse", parseServer.app);

const httpServer = http.createServer(app);
httpServer.listen(PORT, async () => {
  await postStart();
  await checkUsersCode();
  console.log(`Chisel Parse server v${packageJSON.version} running on port ${PORT}.`);
});

/* Live Query Server */
// const lqServer = ParseServer.createLiveQueryServer(httpServer);
