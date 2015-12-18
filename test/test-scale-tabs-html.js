var PageMod = require("sdk/page-mod").PageMod,
    tabs = require("sdk/tabs"),
    { setTimeout } = require("sdk/timers"),
    self = require("sdk/self");

exports["test panel html for receiving data and render images"] =
        function (assert, done) {
    var page_mod = PageMod({
            include: self.data.url("scale-tabs.html"),
            contentScriptFile: [
                self.data.url("scale-tabs.js"),
                self.data.url("test-helper-scale-tabs.js")
            ],
            onAttach: function (worker) {
                worker.port.on("html", function (html) {
                    assert.equal(html.trim(), "<h1>Abobrinha</h1>");
                    done();
                });
                worker.port.emit("tabs", [
                    {image: "abobrinha1.png"}
                ]);
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

require("sdk/test").run(exports);
