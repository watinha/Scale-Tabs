function ScaleTabsPanel (args) {
    this._windows = args.windows;
    this._viewFor = args.viewFor;
    this._panel = args.panel;
}

ScaleTabsPanel.prototype.show = function () {
    var active_window = this._viewFor(this._windows.activeWindow);
    this._panel.show({
        height: 300,
        width: active_window.innerWidth,
        position: {
            bottom: 0
        }
    });
};

ScaleTabsPanel.prototype.hide = function () {
    this._panel.hide();
};

ScaleTabsPanel.prototype.send_tabs = function (data) {
    this._panel.port.emit("tabs", data);
};

ScaleTabsPanel.prototype.send_search = function (data) {
    this._panel.port.emit("search", data);
};

ScaleTabsPanel.prototype.isShowing = function () {
    return this._panel.isShowing();
};

module.exports = ScaleTabsPanel;
