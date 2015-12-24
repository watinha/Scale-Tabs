function ScaleTabsPanel (args) {
    this.windows = args.windows;
    this.viewFor = args.viewFor;
    this.panel = args.panel;
}

ScaleTabsPanel.prototype.show = function () {
    var active_window = this.viewFor(this.windows.activeWindow);
    this.panel.show({
        height: 300,
        width: active_window.innerWidth,
        position: {
            bottom: 0
        }
    });
};

ScaleTabsPanel.prototype.hide = function () {
    this.panel.hide();
};

ScaleTabsPanel.prototype.send_tabs = function (data) {
    this.panel.port.emit("tabs", data);
};

ScaleTabsPanel.prototype.send_search = function (data) {
    this.panel.port.emit("search", data);
};

ScaleTabsPanel.prototype.isShowing = function () {
    return this.panel.isShowing();
};

module.exports = ScaleTabsPanel;
