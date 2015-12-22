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


exports["test App._set_urlbar_listener should " +
        "set focus, blur and keyup listeners on gURLBar"] =
        function (assert) {
    var windows_mock = {},
        browser_window_mock = {},
        xul_browser_window_mock = {
            gURLBar: {
                addEventListener: function (type, callback) {
                    listener_set++;
                    assert.equal(type, "focus");
                    assert.equal(callback, "focus ok");

                    this.addEventListener = function (type, callback) {
                        listener_set++;
                        assert.equal(type, "blur");
                        assert.equal(callback, "blur ok");
                        this.addEventListener =
                                function (type, callback) {
                            listener_set++;
                            assert.equal(type, "keyup");
                            assert.equal(callback, "keyup ok");
                        }
                    }
                }
            }
        },
        viewFor = function (browser_window) {
            assert.strictEqual(browser_window, browser_window_mock);
            return xul_browser_window_mock;
        },
        listener_set = 0,
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: viewFor
        });

    app_instance._show_panel = function () {}
    app_instance._show_panel.bind = function (scope){
        assert.equal(scope, app_instance);
        return "focus ok";
    };
    app_instance._hide_panel = function () {}
    app_instance._hide_panel.bind = function (scope){
        assert.equal(scope, app_instance);
        return "blur ok";
    };
    app_instance._search = function () {}
    app_instance._search.bind =
            function (scope, gURLBar){
        assert.equal(scope, app_instance);
        assert.strictEqual(gURLBar, xul_browser_window_mock.gURLBar);
        return "keyup ok";
    };

    app_instance._set_urlbar_listener(browser_window_mock);
    assert.equal(listener_set, 3);
};

exports["test _show_panel should open a panel"] = function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        tabs_stub = [{
            getThumbnail: function () { return "image1"; }
        }],
        panel_mock = {
            show: function () {
                showed = "ok";
            },
            send_tabs: function () {}
        },
        showed = "false",
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock,
            tabs: tabs_stub
        });
    app_instance._show_panel();
    assert.equal(showed, "ok");
};

exports["test _show_panel should send title and thumbnails to panel"] =
        function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        tabs_stub = [{
            getThumbnail: function () { return "image1"; },
            title: "Title 1",
            url: "abobrinha1.com"
        }],
        panel_mock = {
            show: function () {},
            send_tabs: function (json) {
                send_tabs_called = "ok";
                assert.deepEqual(json, [{
                    image:"image1",
                    url: "abobrinha1.com",
                    title: "Title 1"
                }]);
            }
        },
        send_tabs_called = "",
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock,
            tabs: tabs_stub
        });
    app_instance._show_panel();
    assert.equal(send_tabs_called, "ok");
};

exports["test _show_panel should send multiple tabs to panel"] =
        function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        tabs_stub = [
            {
                title: "Title 1",
                url: "ab1.com",
                getThumbnail: function () { return "image1"; }
            }, {
                title: "Title 2",
                url: "ab2.com",
                getThumbnail: function () { return "image2"; }
            }, {
                title: "Title 3",
                url: "ab3.com",
                getThumbnail: function () { return "image3"; }
            }, {
                title: "Title 4",
                url: "ab4.com",
                getThumbnail: function () { return "image4"; }
            }, {
                title: "Title 5",
                url: "ab5.com",
                getThumbnail: function () { return "image5"; }
            }
        ],
        panel_mock = {
            show: function () {},
            send_tabs: function (json) {
                send_tabs_called = "ok";
                assert.deepEqual(json, [
                    {title: "Title 1", url: "ab1.com", image:"image1"},
                    {title: "Title 2", url: "ab2.com", image:"image2"},
                    {title: "Title 3", url: "ab3.com", image:"image3"},
                    {title: "Title 4", url: "ab4.com", image:"image4"},
                    {title: "Title 5", url: "ab5.com", image:"image5"}
                ]);
            }
        },
        send_tabs_called = "",
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock,
            tabs: tabs_stub
        });
    app_instance._show_panel();
    assert.equal(send_tabs_called, "ok");
};

exports["test _hide_panel should hide a panel"] = function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        panel_mock = {
            hide: function () {
                hiden = "ok";
            }
        },
        hiden = "false",
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock
        });
    app_instance._hide_panel();
    assert.equal(hiden, "ok");
};

exports["test _search should send value to panel"] =
        function (assert) {
    var windows_mock = {},
        view_for_mock = function () {},
        gURLBar_mock = { value: "abobrinha" },
        send_search_count = 0,
        panel_mock = {
            send_search: function (search) {
                assert.equal(search, "abobrinha");
                send_search_count++;
            }
        },
        app_instance = new App({
            browserWindows: windows_mock,
            viewFor: view_for_mock,
            panel: panel_mock
        });
    app_instance._search(gURLBar_mock);
    assert.equal(send_search_count, 1);
};

require("sdk/test").run(exports);
