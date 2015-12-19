function ScaleTabsPanel (args) {
    this.windows = args.windows;
    this.viewFor = args.viewFor;
    this.panel = args.panel;
    this.self = args.self;
}

ScaleTabsPanel.prototype.show = function () {
    var active_window = this.viewFor(this.windows.activeWindow);
    this.panel.show({
        height: 400,
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

module.exports = ScaleTabsPanel;
