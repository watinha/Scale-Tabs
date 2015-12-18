self.port.on("tabs", function () {
    self.port.emit("html", document.body.innerHTML);
});
