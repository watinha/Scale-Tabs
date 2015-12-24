function App (args) {
    this.windows = args.browserWindows;
    this.view_for_function = args.viewFor;
    this.panel = args.panel;
    this.tabs = args.tabs;
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
    xul_browser_window.gURLBar.addEventListener("keyup",
        this._search.bind(this, xul_browser_window.gURLBar));
};

App.prototype._show_panel = function () {
    this.panel.show();

    var tabs_json = [];
    for (let tab of this.tabs) {
        tabs_json.push({
            url: tab.url,
            title: tab.title,
            image: tab.getThumbnail()
        });
    }
    this.panel.send_tabs(tabs_json);
};

App.prototype._hide_panel = function () {
    this.panel.hide();
};

App.prototype._search = function (gURLBar) {
    if ( ! this.panel.isShowing())
        this._show_panel();
    this.panel.send_search(gURLBar.value);
};

module.exports = App;
