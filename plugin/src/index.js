"use strict";
function init(modules) {
    const ts = modules.typescript;
    function create(info) {
        info.project.projectService.logger.info("tsserver-profiler loaded");
        info.project.projectService.logger.info(ts.startTracing != null ? 'startTracing available' : 'startTracing not available');
        // Set up decorator object
        const proxy = { ...info.languageService };
        return proxy;
    }
    return { create };
}
module.exports = init;
//# sourceMappingURL=index.js.map