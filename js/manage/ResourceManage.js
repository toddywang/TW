/**
 * HomeWork Page
 * Author: Toddy Wang
 * CreateTime: 2015-11-21
 */
define(function (require, exports, module) {
    var resourceService = require("resourceService");

    var rm;

    function ResourceManage() {
    }

    rm = ResourceManage;

    function CommonResult() {
        this.Result = "";
        this.Flag = false;
        this.Error = false;
    }

    rm.prototype.getLocalStorageData = function (localStorageName) {
        return resourceService.getLocalStorageData(localStorageName);
    };

    rm.prototype.setLocalStorageData = function (localStorageName, data) {
        resourceService.setLocalStorageData(localStorageName, JSON.stringify(data));
    };

    rm.prototype.addResource = function (localStorageName, addDataArr) {
        var res = new CommonResult();
        try {
            var oldDataList = resourceService.GetLocalStorageData(localStorageName),
                oldResourceList = oldDataList.ResourcesList,
                oldLen = oldResourceList === undefined ? 0 : oldResourceList.length,
                addResourcesList = resourceService.addData(oldResourceList, addDataArr);

            oldDataList.ResourcesList = addResourcesList;
            if (addResourcesList.length > oldLen) {
                resourceService.setLocalStorageData(localStorageName, JSON.stringify(oldDataList));
                res.Flag = true;
            } else {
                res.Result = "添加失败";
            }
        } catch (ex) {
            res.Error = true;
            res.Result = "请求异常";
        }

        return res;
    };

    rm.prototype.deleteResource = function (localStorageName, resourceId) {
        var res = new CommonResult();
        try {
            var oldDataList = resourceService.GetLocalStorageData(localStorageName),
                oldResourceList = oldDataList.ResourcesList,
                deleteResourcesList = resourceService.deleteData(oldResourceList, resourceId);

            oldDataList.ResourcesList = deleteResourcesList;
            resourceService.setLocalStorageData(localStorageName, JSON.stringify(oldDataList));
            res.Flag = true;
        } catch (ex) {
            res.Error = true;
            res.Result = "请求异常";
        }

        return res;
    };

    rm.prototype.addHistory = function (localStorageName, historyData) {
        try {
            var oldHistoryList = resourceService.GetLocalStorageData(localStorageName);
            var oldLen = (oldHistoryList === undefined || oldHistoryList === null) ? 0 : oldHistoryList.length;
            var addHistoryList = resourceService.addData(oldHistoryList, historyData);
            if (addHistoryList.length > oldLen) {
                resourceService.setLocalStorageData(localStorageName, JSON.stringify(addHistoryList));
            }
        } catch (ex) {
        }
    };

    module.exports = new ResourceManage();
});