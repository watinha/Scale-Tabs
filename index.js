var App = require("lib/app"),
    Panel = require("sdk/panel").Panel,
    browserWindows = require("sdk/windows").browserWindows,
    { viewFor } = require("sdk/view/core"),
    instance = null,
    panel = null;

panel = Panel({
    width: 400,
    height: 400,
    contentURL: "http://wwatana.be"
});

(new App(browserWindows, viewFor, panel)).init();
