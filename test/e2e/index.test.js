'use strict';
/* @flow */

const fs = require('fs');
const test = require('tape');
const webDriver = require('../appium/web_driver.js');

test('APPIUM: start app', t => {
  webDriver.createDriver().then(() => {
    t.end();
  }).catch(t.end);
});

test('APPIUM: check welcome message', t => {
  webDriver.getDriver().then(driver => {
    return driver.waitForElementByAccessibilityId('Home')
      .elementByAccessibilityId('Welcome')
      .getValue();
  }).then(value => {
    t.equal(value,'Welcome to React Native!');
    t.end();
  }).catch(t.end);
});

test('APPIUM: take screenshot', t => {
  webDriver.getDriver().then(driver => {
    return driver.takeScreenshot();
  }).then(value => {
    fs.writeFileSync('./test/_tmp/screenshot.png',value,'base64');
    t.end();
  }).catch(t.end);
});

test('APPIUM: close', t => {
  webDriver.stop().then(done => {
    t.ok(done,'stop succesfully');
    t.end();
  }).catch(t.end);
});
