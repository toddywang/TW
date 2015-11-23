/**
 * HomeWork Page
 * Author: Toddy Wang
 * CreateTime: 2015-11-21
 */
define(function (require, exports, module) {
    var store = require('store');
    var db;

    function LocalStorage() {
    }

    db = LocalStorage;

    db.prototype.getData = function (key) {
        if (window.localStorage) {
            return window.localStorage.getItem(key);
        } else {
            return store.get(key);
        }

    };

    db.prototype.setData = function (key, val) {
        if (window.localStorage) {
            window.localStorage.setItem(key, val);
        } else {
            store.set(key, val);
        }
    };

    module.exports = new LocalStorage();
});
