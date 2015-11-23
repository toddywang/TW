define(function (require) {
    var resourceService;

    describe("Add Resources and Delete Resource", function () {
        var resourceService;


        beforeEach(function () {
            resourceService = require("resourceService");
        });

        it("should be able delete a resource", function () {
            var resourceList = [
                {KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'},
                {KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'}
            ];

            var tempData = expect(resourceService.deleteData(resourceList, 2));
            tempData.toContain({KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'});
            tempData.toContain({KeyID: 2, AgentID: 2, IsDelete: 1, ResourceName: 'resource 2'});

            tempData.not.toContain({KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'});
        });

        it("should be able add a resource", function () {
            var resourceList = [
                {KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'},
                {KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'}
            ];

            var addResourceList = [
                {AgentID: 1, IsDelete: 0, ResourceName: 'resource 3'}
            ];

            var tempData = expect(resourceService.addData(resourceList, addResourceList));
            tempData.toContain({KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'});
            tempData.toContain({KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'});
            tempData.toContain({KeyID: 3, AgentID: 1, IsDelete: 0, ResourceName: 'resource 3'});

            tempData.not.toContain({KeyID: 4, AgentID: 1, IsDelete: 0, ResourceName: 'resource 3'});
        });

        it("should be able add resources", function () {
            var resourceList = [
                {KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'},
                {KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'}
            ];

            var addResourceList = [
                {AgentID: 1, IsDelete: 0, ResourceName: 'resource 3'},
                {AgentID: 1, IsDelete: 0, ResourceName: 'resource 4'}
            ];

            var tempData = expect(resourceService.addData(resourceList, addResourceList));
            tempData.toContain({KeyID: 1, AgentID: 1, IsDelete: 0, ResourceName: 'resource 1'});
            tempData.toContain({KeyID: 2, AgentID: 2, IsDelete: 0, ResourceName: 'resource 2'});
            tempData.toContain({KeyID: 3, AgentID: 1, IsDelete: 0, ResourceName: 'resource 3'});
            tempData.toContain({KeyID: 4, AgentID: 1, IsDelete: 0, ResourceName: 'resource 4'});

            tempData.not.toContain({KeyID: 4, AgentID: 2, IsDelete: 0, ResourceName: 'resource 3'});
            tempData.not.toContain({KeyID: 3, AgentID: 2, IsDelete: 0, ResourceName: 'resource 4'});
        });
    });
});