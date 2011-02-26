/**********************************************************************
 *
 *  module name: window_screenshot module
 *  author: Willian Massami Watanabe (talk@watinha.com)
 *  last changed: 10/02/2011
 *
 **********************************************************************/

/*
 * This module basically executes the following two functions:
 *  1. take screenshots of the tabs
 *  2. change the active tabs
 */

/*
 * Base require statements for the tabs and tab-browser modules.
 */
var tabs = require("tabs");
const tab_browser = require("tab-browser");

/*
 * screenshot window object export generation code.
 */
exports.get_Screenshot_window = function(){
  return new Screenshot_window();
};

/*
 * Screenshot_window class definition, along with the constructor
 */
function Screenshot_window(){
  this.mTabBrowserObject;
  this.mLength = tabs.length;
  var self = this;

  /*
   * The tabs module does not hold the permission to read the content window object
   *  for tabs, and therefore it cannot take screenshots of the tabs. In order to 
   *  overcome this issue we used the tab-browser module (tabbrowser object more 
   *  specifically) that has access to the contentWindow of the active tabs.
   */
  var screenshot_window_object = this;
  let tracker = {
    onTrack: function(tabbrowser) {
      screenshot_window_object.mTabBrowserObject = tabbrowser;
    },
    onUntrack: function(tabbrowser) {
    }
  };  
  tab_browser.Tracker(tracker);

  /*
   * Then we set the tabs on open event handlers to take the screenshots as soon as
   *  the tabs are openned and ready.
   */
  tabs.on("ready", function(tab){
    if(tab.title != self.constants.SCALE_TABS_TAB_TITLE)
      screenshot_window_object.load_tab_data(tab);
  });
};

/*
 * Constants of the Screenshot_window class
 */
Screenshot_window.prototype.constants = {
  SCREENSHOTS_SIZE: 150,
  SCALE_TABS_TAB_TITLE: "Scale Tabs - Tab selector page"
};

/*
 * Screenshot_window class method change_tab: function responsible for changing the active tab_index
 *  @param tab_index: integer that identifies the tab that is to be set active.
 */
Screenshot_window.prototype.change_tab = function(tab_index){
  tabs.activeTab.close();
  this.mTabBrowserObject.selectTabAtIndex(tab_index);
};

/*
 * Screenshot_window class method load_tab_data: responsible for setting one specific tab as active
 *  in order to take its screenshot. As a result the tab object will be enhanced with the screenshot
 *  attribute that contains the base64 image of the tab window object.
 *  @param tab: tab object from the tabs module that identifies the tab that is to be taken screenshot
 */
Screenshot_window.prototype.load_tab_data = function(tab){
  tab.screenshot = tab.getThumbnail();
};
