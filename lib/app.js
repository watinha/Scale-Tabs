function App (args) {
    this._windows = args.browserWindows;
    this._view_for_function = args.viewFor;
    this._panel = args.panel;
    this._tabs = args.tabs;
}

App.prototype.init = function () {
    this._windows.on("open", this._set_urlbar_listener.bind(this));
    this._set_urlbar_listener(this._windows.activeWindow);
};

App.prototype._set_urlbar_listener = function (browser_window) {
    var xul_browser_window = this._view_for_function(browser_window);
    xul_browser_window.gURLBar.addEventListener("focus",
        this._show_panel.bind(this));
    xul_browser_window.gURLBar.addEventListener("blur",
        this._hide_panel.bind(this));
    xul_browser_window.gURLBar.addEventListener("keyup",
        this._search.bind(this, xul_browser_window.gURLBar));
};

App.prototype._show_panel = function () {
    this._panel.show();

    var tabs_json = [];
    for (let tab of this._tabs) {
        tabs_json.push({
            url: tab.url,
            title: tab.title,
            image: tab.getThumbnail()
        });
    }
    this._panel.send_tabs(tabs_json);
};

App.prototype._hide_panel = function () {
    this._panel.hide();
};

App.prototype._search = function (gURLBar) {
    if ( ! this._panel.isShowing())
        this._show_panel();
    this._panel.send_search(gURLBar.value);
};

module.exports = App;
