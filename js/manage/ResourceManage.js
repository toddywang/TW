/**
 * HomeWork Page
 * Author: Toddy Wang
 * CreateTime: 2015-11-21
 */
define(function (require, exports, module) {
    var resourceService = require("resourceService");

    var rc;

    function ResourceManage() {
    }

    rc = ResourceManage;

    function CommonResult() {
        this.Result = "";
        this.Flag = false;
        this.Error = false;
    }

    rc.prototype.GetLocalStorageData = function (localStorageName) {
        return resourceService.GetLocalStorageData(localStorageName);
    };

    rc.prototype.SetLocalStorageData = function (localStorageName, data) {
        resourceService.SetLocalStorageData(localStorageName, JSON.stringify(data));
    };

    rc.prototype.AddResource = function (localStorageName, addDataArr) {
        var res = new CommonResult();
        try {
            var oldDataList = resourceService.GetLocalStorageData(localStorageName),
                oldResourceList = oldDataList.ResourcesList,
                oldLen = oldResourceList === undefined ? 0 : oldResourceList.length,
                addResourcesList = resourceService.AddData(oldResourceList, addDataArr);

            oldDataList.ResourcesList = addResourcesList;
            if (addResourcesList.length > oldLen) {
                resourceService.SetLocalStorageData(localStorageName, JSON.stringify(oldDataList));
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

    rc.prototype.DeleteResource = function (localStorageName, resourceId) {
        var res = new CommonResult();
        try {
            var oldDataList = resourceService.GetLocalStorageData(localStorageName),
                oldResourceList = oldDataList.ResourcesList,
                deleteResourcesList = resourceService.DeleteData(oldResourceList, resourceId);

            oldDataList.ResourcesList = deleteResourcesList;
            resourceService.SetLocalStorageData(localStorageName, JSON.stringify(oldDataList));
            res.Flag = true;
        } catch (ex) {
            res.Error = true;
            res.Result = "请求异常";
        }

        return res;
    };

    rc.prototype.addHistory = function (localStorageName, historyData) {
        try {
            var oldHistoryList = resourceService.GetLocalStorageData(localStorageName);
            var oldLen = (oldHistoryList === undefined || oldHistoryList === null) ? 0 : oldHistoryList.length;
            var addHistoryList = resourceService.AddData(oldHistoryList, historyData);
            if (addHistoryList.length > oldLen) {
                resourceService.SetLocalStorageData(localStorageName, JSON.stringify(addHistoryList));
            }
        } catch (ex) {
        }
    };

    module.exports = new ResourceManage();
});