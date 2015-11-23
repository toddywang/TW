/**
 * HomeWork Page
 * Author: Toddy Wang
 * CreateTime: 2015-11-21
 */
define(function (require) {
    require('html5Validate');

    /**
     * 公共函数
     */
    var resourceManage = require("resourceManage");

    /**
     * 本地存储名称
     * @type {string}
     * @private
     */
    var _localStorageAgentName_ = "TWAgents";
    var _localStorageHistoryName_ = "TWHistory";

    /**
     * 配置agent类型
     * @type {*[]}
     * @private
     */
    var _agentTypeOption_ = [
        {AgentType: 1, AgentName: "Physical"},
        {AgentType: 2, AgentName: "Virtual"}
    ];

    /**
     * Summary类型配置
     * @type {*[]}
     * @private
     */
    var _summaryTypeOption_ = [
        {SummaryType: 1, SummaryName: "building"},
        {SummaryType: 2, SummaryName: "idle"}
    ];

    /**
     * 缓存数据
     * @type {{}}
     * @private
     */
    var _cachePagerData_ = {};
    var _cacheHistoryData_ = {};

    /**
     * 提示语句
     * @param $ctrlName 对应dom
     * @param msg 提示语句
     */
    var validateMsg = function ($ctrlName, msg) {
        var option = {
            css: {
                zIndex: 19910903
            }
        };
        $ctrlName.testRemind(msg, option).get(0).focus();
    };

    /**
     * 处理页面公共函数
     * @type {{dealIsVailData: dealIsVailData, dealMainContent: dealMainContent, dealSummary: dealSummary, getHistoryData: getHistoryData, dealContent: dealContent}}
     */
    var commonPagerFunction = {
        dealIsVailData: function (data, agentType) {
            var isVailDataList = {};
            if (agentType === undefined || agentType === "") {
                isVailDataList = _.where(data.AgentList, {IsDelete: 0});
            } else {
                isVailDataList = _.where(data.AgentList, {IsDelete: 0, AgentType: parseInt(agentType, 10)});
            }

            return isVailDataList;
        },
        dealMainContent: function (data, agentType) {
            var isVailDataList = commonPagerFunction.dealIsVailData(data, agentType);
            if (isVailDataList.length > 0) {
                for (var item = 0, len = isVailDataList.length; item < len; item++) {
                    isVailDataList[item].ResourcesList = _.where(data.ResourcesList, {
                        IsDelete: 0,
                        AgentID: isVailDataList[item].KeyID
                    });
                }
            }

            return isVailDataList;
        },
        dealSummary: function (data, agentType) {
            var resDataArr     = [],
                summaryArr     = _summaryTypeOption_,
                isVailDataList = commonPagerFunction.dealIsVailData(data, agentType);

            for (var i = 0, len = summaryArr.length; i < len; i++) {
                var summaryObj = summaryArr[i];
                var resDataObj = {
                    SummaryName: summaryObj.SummaryName,
                    Num: _.where(isVailDataList, { SummaryType: summaryObj.SummaryType, IsDelete: 0 }).length
                };
                resDataArr.push(resDataObj);
            }

            return resDataArr;
        },
        getHistoryData: function (data) {
            var newDataArr = [],
                dataLen    = data.length;
            if (dataLen > 0) {
                var sortData = data.sort(
                    function (a, b) {
                        return b.Time - a.Time;
                    }
                );

                var len = dataLen < 10 ? sortData.length : 10;
                for (var i = 0; i < len; i++) {
                    newDataArr.push(sortData[i]);
                }
            }

            return newDataArr;
        },
        /**
         * 处理主框架数据
         * @param agentData 所有数据
         * @param historyData 历史数据
         * @param agentType 查询条件
         * @returns {*}
         */
        dealContent: function (agentData, historyData, agentType) {
            require("underscore");
            require("jsRender");

            /**
             * content部分
             */
            $("#articleContent").html($("#contentWidget").render(commonPagerFunction.dealMainContent(agentData, agentType)));

            /**
             * summary部分
             */
            $("#summaryContent").html($("#summaryTemp").render(commonPagerFunction.dealSummary(agentData, agentType)));

            if (historyData !== null) {
                $("#historyContent").html($("#historyTemp").render(commonPagerFunction.getHistoryData(historyData)));
            }
        }
    };

    var CommonDealData = {
        getResourceList: function (resourceStr, agentId) {
            var resourceListArr = [],
                resourceArr     = resourceStr.split(',');

            for (var i = 0, len = resourceArr.length; i < len; i++) {
                var resourceName = resourceArr[i];
                if (resourceName !== "") {
                    var resourceObj = {
                        ResourceName: resourceName,
                        AgentID: parseInt(agentId, 10),
                        IsDelete: 0
                    };

                    resourceListArr.push(resourceObj);
                }
            }

            return resourceListArr;
        },
        getHistoryList: function (data, id, resource) {
            var historyListData = [],
                nowDate         = new Date().getTime(),
                historyObj      = {Word: "", Time: nowDate, AgentID: parseInt(id, 10), IsDelete: 0},
                titleName       = "";

            if (resource !== undefined && resource !== "") {
                titleName = _.where(data.AgentList, {KeyID: parseInt(id, 10), IsDelete: 0})[0].Name;
                historyObj.Word = titleName + "/" + resource + "(add)";
            } else {
                var resourceObj = _.where(data.ResourcesList, {KeyID: parseInt(id, 10)})[0];
                titleName = _.where(data.AgentList, {KeyID: parseInt(resourceObj.AgentID, 10), IsDelete: 0})[0].Name;
                resource = resourceObj.ResourceName;
                historyObj.Word = titleName + "/" + resource + "(delete)";
            }

            historyListData.push(historyObj);
            return historyListData;
        }
    };

    /**
     * agent页面处理类
     * @type {{initSetData: Function, initData: Function, initBindEvent: Function}}
     */
    var agentPagerDetail = {
        /**
         * 当前选择的agent类型
         */
        agentType: $("#main-nav").find("a.active").attr("id"),
        /**
         * 存入初始化数据
         */
        initSetData: function (callBack) {
            /**
             * 初始化存进去
             */
            _cachePagerData_ = resourceManage.GetLocalStorageData(_localStorageAgentName_);
            _cacheHistoryData_ = resourceManage.GetLocalStorageData(_localStorageHistoryName_);
            if (_cachePagerData_ === null || _cachePagerData_ === undefined) {
                require("agentResource");
                _cachePagerData_ = AgentResource;
                resourceManage.SetLocalStorageData(_localStorageAgentName_, AgentResource);
            }

            /**
             * 存完数据，数据化页面
             */
            if (typeof callBack === "function") {
                callBack();
            }
        },
        /**
         * 初始化数据
         */
        initData: function (callBack) {
            /**
             * 处理主框架数据
             * @param data 所有数据
             * @returns {*}
             */
            commonPagerFunction.dealContent(_cachePagerData_, _cacheHistoryData_, agentPagerDetail.agentType);

            /**
             * 处理agent所有类型
             */
            $("#main-nav").append($("#agentTitleTemp").render(_agentTypeOption_));

            /**
             * 绑定完数据，绑定页面事件
             */
            if (typeof callBack === "function") {
                callBack();
            }
        },
        /**
         * 初始化绑定事件
         */
        initBindEvent: function () {
            var articleContent = $("#articleContent");

            /**
             * 筛选条件切换事件绑定
             */
            $("#main-nav").find(".agentSearch").off("click").on("click", function () {
                $("#main-nav").find(".agentSearch").removeClass("active");
                $(this).addClass("active");

                agentPagerDetail.agentType = $(this).attr("id");
                commonPagerFunction.dealContent(_cachePagerData_, _cacheHistoryData_, agentPagerDetail.agentType);
                agentPagerDetail.initBindEvent();
            });

            /**
             * 添加资源弹出层
             */
            articleContent.find(".resourceAdd a").off("click").on("click", function () {
                $("#articleContent").find(".addResource").removeClass("active");
                $(this).parents("li:first").find(".addResource").addClass("active");
            });

            /**
             * 添加层关闭
             */
            articleContent.find(".closeBtn").off("click").on("click", function () {
                $(this).parents(".addResource:first").removeClass("active");
            });

            /**
             * 添加资源
             * @param obj 对应对象
             */
            window.addResource = function (obj) {
                var resource = $.trim($(obj).parents("div:first").find("[name='resource']").val()),
                    agentId  = $(obj).attr("agentId");

                if (resource === "") {
                    validateMsg($(obj).parents("div:first").find("[name='resource']"), "必填");
                    return;
                }

                var addDataArr = CommonDealData.getResourceList(resource, agentId);
                if (resource !== "" && addDataArr.length === 0) {
                    validateMsg($(obj).parents("div:first").find("[name='resource']"), "没有合法的可添加数据(温馨提示:添加多个以半角英文逗号分隔)");
                    return;
                }

                var result = resourceManage.AddResource(_localStorageAgentName_, addDataArr);
                if (result.Error) {
                    alert(result.Result);
                    return;
                }

                var agentData = resourceManage.GetLocalStorageData(_localStorageAgentName_);
                _cachePagerData_ = agentData;
                if (result.Flag) {
                    try {
                        var addHistoryArr = CommonDealData.getHistoryList(_cachePagerData_, agentId, resource);
                        resourceManage.addHistory(_localStorageHistoryName_, addHistoryArr);
                        var historyData = resourceManage.GetLocalStorageData(_localStorageHistoryName_);
                        _cacheHistoryData_ = historyData;
                    } catch (ex) {
                    }
                } else {
                    alert(result.Result);
                }

                commonPagerFunction.dealContent(_cachePagerData_, _cacheHistoryData_, agentPagerDetail.agentType);
                agentPagerDetail.initBindEvent();
            };

            /**
             * 删除对象
             * @param obj 对应对象
             */
            window.deleteResource = function (obj) {
                var resourceId = $(obj).attr("id");
                var result = resourceManage.DeleteResource(_localStorageAgentName_, resourceId);
                if (result.Error) {
                    alert(result.Result);
                    return;
                }

                var agentData = resourceManage.GetLocalStorageData(_localStorageAgentName_);
                _cachePagerData_ = agentData;
                if (result.Flag) {
                    try {
                        var addHistoryArr = CommonDealData.getHistoryList(_cachePagerData_, resourceId);
                        resourceManage.addHistory(_localStorageHistoryName_, addHistoryArr);
                        var historyData = resourceManage.GetLocalStorageData(_localStorageHistoryName_);
                        _cacheHistoryData_ = historyData;
                    } catch (ex) {
                    }
                } else {
                    alert(result.Result);
                }

                commonPagerFunction.dealContent(_cachePagerData_, _cacheHistoryData_, agentPagerDetail.agentType);
                agentPagerDetail.initBindEvent();
            };
        }
    };

    /**
     * 主函数
     * @type {{initEvent: Function, main: Function}}
     */
    var mainModule = {
        /*============================ 内部变量 ==========================*/
        /*============================ 内部函数 ==========================*/
        /** 事件初始化 */
        initEvent: function () {
            /**
             * 先初始化数据，再行绑定页面事件
             */
            agentPagerDetail.initSetData(function () {
                agentPagerDetail.initData(function () {
                    agentPagerDetail.initBindEvent();
                });
            });

        },
        /** 入口函数 */
        main: function () {
            mainModule.initEvent();
        }
    };

    /**
     * 进入加载
     */
    $(function () {
        mainModule.main();
    });
});