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
        assert.equal(args.height, 300);
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

exports["test scale-tabs-panel should send tabs to panel"] =
        function (assert) {
    var panel_mock = {}, hide_called = "", emit_called = "",
        scale_tabs_panel;
    panel_mock = {
        port: {
            emit: function (ev, data) {
                emit_called = "ok";
                assert.equal(ev, "tabs");
                assert.deepEqual(data, [ {abobrinha: "legal"} ]);
            }
        }
    };
    scale_tabs_panel = new ScaleTabsPanel({
        panel: panel_mock
    });
    scale_tabs_panel.send_tabs([{ abobrinha: "legal" }]);
    assert.equal(emit_called, "ok");
};

exports["test panel should send search values to content script"] =
        function (assert) {
    var panel_mock, emit_called = "", scale_tabs_panel;
    panel_mock = {
        port: {
            emit: function (type, data) {
                assert.equal(type, "search");
                assert.equal(data, "abobrinha");
                emit_called = "ok";
            }
        }
    };
    scale_tabs_panel = new ScaleTabsPanel({
        panel: panel_mock
    });
    scale_tabs_panel.send_search("abobrinha");
    assert.equal(emit_called, "ok");
};

exports["test isShowing should call isShowing in panel"] =
        function (assert) {
    var isShowing_call_count = 0,
        panel_mock = {
            isShowing: function () {
                isShowing_call_count++;
                return "ok isShowing called";
            }
        },
        scale_tabs_panel = new ScaleTabsPanel({
            panel: panel_mock
        });
    assert.equal(scale_tabs_panel.isShowing(), "ok isShowing called");
    assert.equal(isShowing_call_count, 1);
};

require("sdk/test").run(exports);
