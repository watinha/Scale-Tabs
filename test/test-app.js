var App = require("../lib/app");

exports["test app module exists"] = function (assert) {
    assert.pass("app exists");
};

exports["test App.init should set tab listener"] = function (assert) {
    var tabs_mock = {
            on: function (ev_type, callback) {
                on_called = ev_type;
                on_callback = callback;
            }
        },
        on_called = "", on_callback = "", bind_called = "",
        app_instance = new App(tabs_mock);

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

exports["test App._set_urlbar_listener should get gURLBar"] =
        function (assert) {
    var tabs_mock = {},
        app_instance = new App(tabs_mock);
};

require("sdk/test").run(exports);
