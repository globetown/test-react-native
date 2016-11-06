'use strict';

const webDriver = require('./web_driver');
const actionServer = require('./action_server');
const {actions} = require('./test_config');

const EXECUTE_ACTION_ELEMENT_ID = 'Execute';
const START_PAGE_ELEMENT_ID = 'Login';

module.exports = {
  getDriver:webDriver.getDriver,
  runApp,
};

function runApp() {
  return webDriver.createDriver().then(() => {
    return actionServer.startServer();
  });
}

function callApp(opts) {
  if (opts.actions) {
    opts.actions.forEach(actionServer.action);
  }
  if (opts.redirects) {
    opts.redirects.forEach(actionServer.redirect);
  }
  return webDriver.getDriver()
    .elementByAccessibilityId(EXECUTE_ACTION_ELEMENT_ID)
    .click()
}

function redirect(name, params) {
  return callApp({redirects: [{name, params}]});
}
