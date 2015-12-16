function App () { this.tabs = arguments[0]; }

App.prototype.init = function () {
    this.tabs.on("open", this._set_urlbar_listener.bind(this));
};

App.prototype._set_urlbar_listener = function () {
};

module.exports = App;
