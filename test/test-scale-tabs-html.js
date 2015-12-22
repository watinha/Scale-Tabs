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
                    assert.equal(
                        html[0], "<img src=\"abobrinha1.png\">");
                    assert.equal(
                        html[1], "<img src=\"abobrinha2.png\">");
                    assert.equal(
                        html[2], "<img src=\"abobrinha3.png\">");
                    assert.equal(
                        html[3], "<img src=\"abobrinha4.png\">");
                    assert.equal(
                        html[4], "<img src=\"abobrinha5.png\">");
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

exports["test panel html should reset html content before rendering new tabs"] =
        function (assert, done) {
    var page_mod = PageMod({
            include: self.data.url("scale-tabs.html"),
            contentScriptFile: [
                self.data.url("scale-tabs.js"),
                self.data.url("test-helper-scale-tabs.js")
            ],
            onAttach: function (worker) {
                worker.port.on("html", function (html) {
                    assert.equal(
                        html[0], "<img src=\"abobrinha1.png\">");
                    worker.port.on("html", function (html) {
                        assert.equal(
                            html[0], "<img src=\"abobrinha1.png\">");
                        assert.equal(
                            html[1], "<img src=\"abobrinha2.png\">");
                        assert.equal(html.length, 2);
                        done();
                    });
                    worker.port.emit("tabs", [
                        {image: "abobrinha1.png"},
                        {image: "abobrinha2.png"}
                    ]);
                });
                worker.port.emit("tabs", [
                    {image: "abobrinha1.png"}
                ]);
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

exports["test html should show tabs associated to param in title"] =
        function (assert, done) {
    var page_mod = PageMod({
            include: self.data.url("scale-tabs.html"),
            contentScriptFile: [
                self.data.url("scale-tabs.js"),
                self.data.url("test-helper-scale-tabs.js")
            ],
            onAttach: function (worker) {
                worker.port.on("html_search", function (html) {
                    assert.equal(
                        html[0], "<img src=\"abobrinha1.png\">");
                    assert.equal(
                        html[1], "<img class=\"removido\"" +
                            " src=\"abobrinha2.png\">");
                    assert.equal(
                        html[2], "<img class=\"removido\"" +
                            " src=\"abobrinha3.png\">");
                    assert.equal(
                        html[3], "<img src=\"abobrinha4.png\">");
                    assert.equal(
                        html[4], "<img class=\"removido\"" +
                            " src=\"abobrinha5.png\">");
                    assert.equal(html.length, 5);
                    done();
                });
                worker.port.emit("tabs", [
                    {
                        image: "abobrinha1.png",
                        title: "abobrinha pepino, acucar melao"
                    },
                    {
                        image: "abobrinha2.png",
                        title: "pepino, acucar melao"
                    },
                    {
                        image: "abobrinha3.png",
                        title: "bla blabla blablabla blabla"
                    },
                    {
                        image: "abobrinha4.png",
                        title: "acucar abobrinha melao"
                    },
                    {
                        image: "abobrinha5.png",
                        title: "nada"
                    }
                ]);
                worker.port.emit("search", "abobrinha");
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

exports["test html should show tabs associated to param in URL"] =
        function (assert, done) {
    var page_mod = PageMod({
            include: self.data.url("scale-tabs.html"),
            contentScriptFile: [
                self.data.url("scale-tabs.js"),
                self.data.url("test-helper-scale-tabs.js")
            ],
            onAttach: function (worker) {
                worker.port.on("html_search", function (html) {
                    assert.equal(
                        html[0], "<img src=\"abobrinha1.png\">");
                    assert.equal(
                        html[1], "<img class=\"removido\"" +
                            " src=\"abobrinha2.png\">");
                    assert.equal(
                        html[2], "<img class=\"removido\"" +
                            " src=\"abobrinha3.png\">");
                    assert.equal(
                        html[3], "<img src=\"abobrinha4.png\">");
                    assert.equal(
                        html[4], "<img class=\"removido\"" +
                            " src=\"abobrinha5.png\">");
                    assert.equal(html.length, 5);
                    done();
                });
                worker.port.emit("tabs", [
                    {
                        image: "abobrinha1.png",
                        url: "abobrinha.com"
                    },
                    {
                        image: "abobrinha2.png",
                        url: "pepino.com"
                    },
                    {
                        image: "abobrinha3.png",
                        url: "blablabla.com"
                    },
                    {
                        image: "abobrinha4.png",
                        url: "acucarabobrinha.com"
                    },
                    {
                        image: "abobrinha5.png",
                        url: "nada.com"
                    }
                ]);
                worker.port.emit("search", "abobrinha");
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

exports["test html should reshow tabs on multiple searches in title"] =
        function (assert, done) {
    var page_mod = PageMod({
            include: self.data.url("scale-tabs.html"),
            contentScriptFile: [
                self.data.url("scale-tabs.js"),
                self.data.url("test-helper-scale-tabs.js")
            ],
            onAttach: function (worker) {
                worker.port.on("html_search", function (html) {
                    worker.port.on("html_search",  function (html) {
                        assert.equal(
                            html[0], "<img src=\"abobrinha1.png\">");
                        assert.equal(
                            html[1], "<img src=\"abobrinha2.png\">");
                        assert.equal(
                            html[2], "<img src=\"abobrinha3.png\">");
                        assert.equal(
                            html[3], "<img src=\"abobrinha4.png\">");
                        assert.equal(
                            html[4], "<img src=\"abobrinha5.png\">");
                        assert.equal(html.length, 5);
                        done();
                    });
                });
                worker.port.emit("tabs", [
                    {
                        image: "abobrinha1.png",
                        title: "abobrinha pepino, acucar melao"
                    },
                    {
                        image: "abobrinha2.png",
                        title: "pepino, acucar melao"
                    },
                    {
                        image: "abobrinha3.png",
                        title: "bla blabla blablabla blabla"
                    },
                    {
                        image: "abobrinha4.png",
                        title: "acucar abobrinha melao"
                    },
                    {
                        image: "abobrinha5.png",
                        title: "nada"
                    }
                ]);
                worker.port.emit("search", "abobrinha");
                worker.port.emit("search", "a");
            }
        }),
        message_received = "";
    tabs.activeTab.url = self.data.url("scale-tabs.html");
};

require("sdk/test").run(exports);
