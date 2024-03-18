module.exports = {
    httpRoute: "../lib/http",
    envRoute: "../constants/env.json",
    services: [
        {
            name: "adminService",
            apiDoc: "http://test.cms.casicloud.com/v2/api-docs"
        }
    ],

    ignoreType: ["Timestamp"],
    responseWarp: "ApiResult",
    pageWarp: "PageList",
};
