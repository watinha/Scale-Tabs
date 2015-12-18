var App = require("lib/app"),
    ScaleTabsPanel = require("lib/scale-tabs-panel"),
    Panel = require("sdk/panel").Panel,
    browserWindows = require("sdk/windows").browserWindows,
    { viewFor } = require("sdk/view/core"),
    instance = null,
    panel = null;

panel = new ScaleTabsPanel({
    windows: browserWindows,
    viewFor: viewFor,
    panel: Panel({
        contentURL: "http://wwatana.be",
        focus: false
    })
});

(new App({
    browserWindows: browserWindows,
    viewFor: viewFor,
    panel: panel
})).init();
