var App = require("../lib/app");

exports["test app module exists"] = function (assert) {
    assert.pass("app exists");
};

exports["test App.init should set window listener"] =
        function (assert) {
    var windows_mock = {
            on: function (ev_type, callback) {
                on_called = ev_type;
                on_callback = callback;
            }
        },
        on_called = "", on_callback = "", bind_called = "",
        app_instance = new App({browserWindows: windows_mock});

    app_instance._set_urlbar_listener = function () {};
    app_instance._set_urlbar_listener.bind = function () {
        bind_called = "ok";
        assert.equal(arguments[0], app_instance);
        return "ok bind";
    };

    app_instance.init();
    assert.equal(on_called, "open");
    assert.equal(bind_called, "ok");
    assert.equal(on_callback, "ok bind");
};

exports["test App.init should set listener on current window"] =
        function (assert) {
    var windows_mock = {
            activeWindow: {},
            on: function () {}
        },
        listener_set = "",
        app_instance = new App({browserWindows: windows_mock});

    app_instance._set_urlbar_listener = function (w) {
        listener_set = "ok";
        assert.strictEqual(w, windows_mock.activeWindow);
    };

    app_instance.init();
    assert.equal(listener_set, "ok");
};


exports["test App._set_urlbar_listener should get gURLBar"] =
        function (assert) {
    var windows_mock = {},
        browser_window_mock = {},
        xul_browser_window_mock = {
            addEventListener: function (type, callback) {
                listener_set = "ok";
                assert.equal(type, "focus");
                assert.equal(callback, "callback ok");
            }
        },
        viewFor = function (browser_window) {
            assert.strictEqual(browser_window, browser_window_mock);
            return xul_browser_window_mock;
        },
        listener_set = "",
        app_instance = new App({ browserWindows: windows_mock, viewFor: viewFor });

    app_instance._show_panel = function () {}
    app_instance._show_panel.bind = function (scope){
        assert.equal(scope, app_instance);
        return "callback ok";
    }

    app_instance._set_urlbar_listener(browser_window_mock);
    assert.equal(listener_set, "ok");
};

exports["test _show_panel open a panel"] = function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        panel_mock = {
            show: function () {
                showed = "ok";
            }
        },
        showed = "false",
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock
        });
    app_instance._show_panel();
    assert.equal(showed, "ok");
};

require("sdk/test").run(exports);
