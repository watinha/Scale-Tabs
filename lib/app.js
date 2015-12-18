function App (args) {
    this.windows = args.browserWindows;
    this.view_for_function = args.viewFor;
    this.panel = args.panel;
}

App.prototype.init = function () {
    this.windows.on("open", this._set_urlbar_listener.bind(this));
    this._set_urlbar_listener(this.windows.activeWindow);
};

App.prototype._set_urlbar_listener = function (browser_window) {
    var xul_browser_window = this.view_for_function(browser_window);
    xul_browser_window.gURLBar.addEventListener("focus",
        this._show_panel.bind(this));
    xul_browser_window.gURLBar.addEventListener("blur",
        this._hide_panel.bind(this));
};

App.prototype._show_panel = function () {
    this.panel.show();
};

App.prototype._hide_panel = function () {
    this.panel.hide();
};

module.exports = App;
