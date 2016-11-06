'use strict';
/* @flow */

require('babel-core/register')({presets:['es2015'],plugins:[
  'transform-object-rest-spread',
  'transform-flow-strip-types',
]});

const test = require('tape');
const {createDriver,getDriver,stop} = require('../appium/web_driver.js');

test('APPIUM: start app', t => {
  createDriver().then(() => {
    t.end();
  }).catch(t.end);
});

test('APPIUM: check welcome message', t => {
  getDriver().then(driver => {
    return driver.waitForElementByAccessibilityId('Home')
      .elementByAccessibilityId('Welcome')
      .getValue();
  }).then(value => {
    t.equal(value,'Welcome to React Native!');
    t.end();
  }).catch(t.end);
});

test('APPIUM: close', t => {
  stop().then(done => {
    t.ok(done,'stop succesfully');
    t.end();
  }).catch(t.end);
});
