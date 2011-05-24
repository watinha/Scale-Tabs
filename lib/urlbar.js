/**********************************************************************
 *
 *  module name: urlbar module
 *  author: Willian Massami Watanabe (talk@watinha.com)
 *  last changed: 23/05/2011
 *
 **********************************************************************/

/*
 * This module executes add base behaviour for handling urlbar keyup events
 */

/*
 * Getting the base requirements for handling urlbar events
 */
const window_utils = require("window-utils");

exports.get_urlbar = function (){
  return new UrlBar(); 
}

function UrlBar(){
  this.window;
  this.urlbar;

  /*
   * Getting the browser_window object reference that has the urlbar xul element
   */
  var self = this;
  let tracker = {
    onTrack: function (browser_window) {
      self.window = browser_window;
    },
    onUntrack: function (){
    }
  };
  var tracker = new window_utils.WindowTracker(tracker);

  /*
   * Getting the urlbar xul element
   */
  this.urlbar = this.window.gURLBar;
};

/*
 * Setting the keyup event handler for the urlbar
 */
UrlBar.prototype.set_keyup_handler = function (handler){
  this.urlbar.addEventListener("keyup", handler, true); 
};

/*
 * Clear urlbar content
 */
UrlBar.prototype.clear = function(){
  this.urlbar.textValue = ""; 
};
 
/*
 * set focus for the urlbar
 */ 
UrlBar.prototype.focus = function(){
  this.urlbar.focus();
};

