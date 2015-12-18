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
                    assert.equal(html[0], "<img src=\"abobrinha1.png\">");
                    assert.equal(html[1], "<img src=\"abobrinha2.png\">");
                    assert.equal(html[2], "<img src=\"abobrinha3.png\">");
                    assert.equal(html[3], "<img src=\"abobrinha4.png\">");
                    assert.equal(html[4], "<img src=\"abobrinha5.png\">");
                    done();
                });
                worker.port.emit("tabs", [
                    {image: "abobrinha1.png"},
                    {image: "abobrinha2.png"},
                    {image: "abobrinha3.png"},
                    {image: "abobrinha4.png"},
                    {image: "abobrinha5.png"}
                ]);
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

require("sdk/test").run(exports);
