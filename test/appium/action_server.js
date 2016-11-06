'use strict';

const {createServer} = require('http');

let actions = [];
let redirects = [];
let server;

module.exports = {
  startServer,
  action,
  redirect,
  stop,
};

function startServer() {

  if (server) {
    return server;
  }

  return new Promise(resolve => {
    server = createServer((req,res) => {
      res.end(JSON.stringify({actions,redirects}));
      actions = [];
      redirects = [];
    }).listen(5555,(arg) => {
      console.log('arg',arg);
      resolve(arg);
    });
    process.on('exit',() => {
      server.close();
    });
  });
}

function action(action) {
  actions.push(action);
}

function redirect(route) {
  redirects.push(route);
}

function stop() {
  server && server.close();
}
