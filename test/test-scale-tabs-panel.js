var ScaleTabsPanel = require("../lib/scale-tabs-panel");

exports["test new scale-tabs-panel module"] = function (assert) {
    assert.pass("new module with panel should be tested");
};

exports["test scale-tabs-panel should implement show method and " +
        "is positioned at the bottom and the size of the window"] =
        function (assert) {
    var panel_mock = {}, windows_mock = {}, chrome_window_mock = {},
        viewForMock, show_called = "",
        scale_tabs_panel;
    windows_mock.activeWindow = {};
    viewForMock = function (w) {
        assert.strictEqual(w, windows_mock.activeWindow);
        return chrome_window_mock;
    };
    chrome_window_mock.innerWidth = 994;
    panel_mock.show = function (args) {
        show_called = "ok";
        assert.equal(args.height, 400);
        assert.equal(args.width, 994);
        assert.equal(args.position.bottom, 0);
    };
    scale_tabs_panel = new ScaleTabsPanel({
        panel: panel_mock,
        windows: windows_mock,
        viewFor: viewForMock
    });
    scale_tabs_panel.show();
    assert.equal(show_called, "ok");
};

exports["test scale-tabs-panel should implement hide method"] =
        function (assert) {
    var panel_mock = {},
        hide_called = "",
        scale_tabs_panel;
    panel_mock.hide = function (args) {
        hide_called = "ok";
    };
    scale_tabs_panel = new ScaleTabsPanel({
        panel: panel_mock
    });
    scale_tabs_panel.hide();
    assert.equal(hide_called, "ok");
};

require("sdk/test").run(exports);
