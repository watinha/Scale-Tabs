var App = require("lib/app"),
    ScaleTabsPanel = require("lib/scale-tabs-panel"),
    Panel = require("sdk/panel").Panel,
    browserWindows = require("sdk/windows").browserWindows,
    tabs = require("sdk/tabs"),
    { viewFor } = require("sdk/view/core"),
    self = require("sdk/self"),
    instance = null,
    panel = null;

panel = new ScaleTabsPanel({
    windows: browserWindows,
    viewFor: viewFor,
    panel: Panel({
        contentURL: self.data.url("scale-tabs.html"),
        contentScriptFile: self.data.url("scale-tabs.js"),
        focus: false
    })
});

(new App({
    browserWindows: browserWindows,
    viewFor: viewFor,
    panel: panel,
    tabs: tabs
})).init();
