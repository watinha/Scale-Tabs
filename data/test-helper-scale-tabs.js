self.port.on("tabs", function () {
    self.port.emit("html", (function () {
        var childs = document.querySelectorAll("body > *"),
            data = [];
        for (var i = 0; i < childs.length; i++) {
            data.push(childs[i].outerHTML);
        }
        return data;
    }()));
});
