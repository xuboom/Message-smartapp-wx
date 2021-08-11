/**
 * @file app.js
 * @author wx
 */

const http = require('./lib/service/http');
//const api = require('./lib/service/api');

/* globals wx */

App({
    onLaunch(options) {
        // do something when launch
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    },
    http,
});
