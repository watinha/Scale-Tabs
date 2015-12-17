function App (windows, viewFor, panel) {
    this.windows = windows;
    this.view_for_function = viewFor;
    this.panel = panel;
}

App.prototype.init = function () {
    this.windows.on("open", this._set_urlbar_listener.bind(this));
};

App.prototype._set_urlbar_listener = function (browser_window) {
    var xul_browser_window = this.view_for_function(browser_window);
    xul_browser_window.addEventListener("focus",
        this._show_panel.bind(this));
};

App.prototype._show_panel = function () {
    this.panel.show();
};

module.exports = App;
