/**
 * HomeWork Page
 * Author: Toddy Wang
 * CreateTime: 2015-11-21
 */
define(function (require, exports, module) {
    require("underscore");
    var localStorage = require('localStorage');

    var rs;

    function ResourceService() {
    }

    rs = ResourceService;

    rs.prototype.getLocalStorageData = function (localStorageName) {
        return $.parseJSON(localStorage.getData(localStorageName));
    };

    rs.prototype.setLocalStorageData = function (name, data) {
        localStorage.setData(name, data);
    };

    rs.prototype.deleteData = function (data, keyId) {
        var _data_ = data;
        for (var i = 0, len = _data_.length; i < len; i++) {
            if (_data_[i].KeyID === parseInt(keyId, 10)) {
                _data_[i].IsDelete = 1;
            }
        }

        return _data_;
    };

    rs.prototype.addData = function (data, addDataArr) {
        var _data_ = data || [],
            maxKeyID = _.max(_data_, function (item) {
                return item.KeyID;
            }).KeyID || 0;

        for (var i = 0, len = addDataArr.length; i < len; i++) {
            var addDataObj = addDataArr[i];
            addDataObj.KeyID = maxKeyID + (i + 1);
            _data_.push(addDataObj);
        }

        return _data_;
    };

    module.exports = new ResourceService();
});