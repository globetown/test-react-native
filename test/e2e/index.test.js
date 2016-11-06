'use strict';
/* @flow */

require('babel-core/register')({presets:['es2015'],plugins:[
  'transform-object-rest-spread',
  'transform-flow-strip-types',
]});

const test = require('tape');
const {runApp,getDriver} = require('../appium/appium_utils.js');

test('APPIUM: start app', t => {
  runApp().then(() => {
    console.log('done');
    t.end();
  }).catch(t.end);
});

test('APPIUM: check welcome message', t => {
  getDriver().then((driver) => {
    return driver.waitForElementByAccessibilityId('Home')
      .elementByAccessibilityId('Welcome')
      .getValue();
  }).then(value => {
    t.equal(value,'Welcome to react Native!');
    t.end();
  }).catch(t.end);
});
