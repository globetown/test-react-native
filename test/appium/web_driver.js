'use strict';
/* @flow */

const wd = require('wd');
const {spawn} = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');
const {APPIUM_PORT,WEBDRIVER_CAPS,IS_TRAVIS} = require('./test_config');
const APP_DIR = path.resolve('.');

let driver;

module.exports = {
  getDriver,
  createDriver,
  stop,
  buildApp,
  startAppium,
};

function getDriver() {
  return new Promise(resolve => {
    process.nextTick(() => resolve(driver));
  });
}

function createDriver() {

  if (driver) {
    return Promise.resolve(driver);
  }

  return buildApp().then(() => {
    return startAppium();
  }).then(() => {
    return waitPort(APPIUM_PORT)
  }).then(() => {
    return createWebDriver();
  });
}

function stop() {
  return driver && driver.quit().catch(e => {
    console.log('ERROR:STOP');
  });
}

function buildApp() {

  try {
    const buildDir = fs.readdirSync(APP_DIR + '/' + WEBDRIVER_CAPS.app);
    if (buildDir.length) {
      return Promise.resolve();
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return new Promise(resolve => {
    const build = spawn(APP_DIR + '/scripts/build-tests.sh');
    build.on('close',resolve);
    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);
  });
}

function logsHandler(driver) {
  driver.on('status', info => {
    console.log(info);
  });
  driver.on('command', (meth, path, data) => {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });
  driver.on('http', (meth, path, data) => {
    console.log(' > ' + meth.magenta, path, (data || '').grey);
  });
}

function startAppium() {
  return checkPort(APPIUM_PORT).catch(error => {
    new Promise(resolve => {
      const appium = spawn('appium');
      process.on('exit',() => {
        appium.kill('SIGHUP');
      });
      appium.stderr.pipe(process.stderr);
      appium.stdout.pipe(process.stdout);
      if (IS_TRAVIS) {
      }
      resolve();
    })
  });
}

function checkPort(port) {
  return new Promise((resolve,reject) => {
    const client = net.connect(port,resolve);
    client.on('error', err => {
      client.destroy();
      reject();
    });
  });
}

function waitPort(port) {
  return checkPort(port).catch(e => new Promise((resolve,reject) => {
    setTimeout(() => waitPort(port).then(resolve,reject));
  }));
}

function createWebDriver() {
  const serverConfig = {host:'localhost',port:4723};
  driver = wd.promiseChainRemote(serverConfig);
  logsHandler(driver);
  return driver.init(WEBDRIVER_CAPS);
}
