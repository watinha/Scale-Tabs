/**********************************************************************
 *
 *  module name: main module of the Scale tabs addon
 *  author: Willian Massami Watanabe (talk@watinha.com)
 *  last changed: 23/05/2011
 *
 **********************************************************************/

/*
 * This module basically does two things:
 *  1. replaces the about:blank new tab standard webpage with the scale_tabs.html page.
 *  2. add a page_mod for the scale_tabs.html page, in order to communicate chrome privileged data to the webpage, like: tabs title, favicon and screenshot image.
 */

/*
 * Base require calls for tabs, page-mod and self modules
 */
var tabs = require("tabs");
var page_mod = require("page-mod");
var data = require("self").data;
var timer = require("timer");

/*
 * Calling the tabs enhancement module that include the screenshot for the 
 *  tab window for every tab object
 */
var window_screenshot = require("window_screenshot").get_Screenshot_window();


/*
 * Replacing the about:blank new tab standard webpage
 */
tabs.on("ready", function(tab){
  if(tab.url == "about:blank"){
    tab.url = data.url("scale_tabs.html");
  }
});

/*
 * Including the page-mod that will provide the communication from the scale_tabs.html webpage 
 *  with the chrome privileged data of the addon.
 *  - note the data.url("scale_tabs.html") for determining the urls that will be affected by the page-module
 *  - note the data.url("pagemod_code.js") that is the content script to be attached to the webpage
 */
page_mod.PageMod({
  include: [data.url("scale_tabs.html")],
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url("pagemod_code.js")],
  onAttach: function onAttach(worker) {
    /*
     * Calling the url bar get instance method
     */
    var urlbar = require("urlbar").get_urlbar();

    /*
     * Passing the chrome privileged data to the page-mod content script, for all tabs, except the
     *  scale_tabs.html tab specifically.
     */
    for each(var tab in tabs) {
      if (tab.title != "Scale Tabs - Tab selector page"){
        var message = {
          screenshot_size: window_screenshot.constants.SCREENSHOTS_SIZE,
          title: tab.title,
          favicon: tab.favicon,
          screenshot: tab.screenshot,
          index: tab.index,
          type_message: "screenshot"
        };
        worker.postMessage(message);
      }
    };

    /*
     * Setting the urlbar keyup event handler to send the event as a message for the pageMod
     */
    urlbar.set_keyup_handler(function (event){
      var new_event = {
        type_message: "event",
        keyCode: event["keyCode"],
        textValue: urlbar.urlbar.textValue
      };
      worker.postMessage(new_event);
      return false;
    });

    /*
     * Clear and set the focus for the urlbar
     */
    urlbar.clear();
    urlbar.focus();

    /*
     * Handling the messages for closing the scale_tabs.html webpage or changing tabs.
     */
    worker.on('message', function(data) {
      switch(data.type){
        case "close":
          tabs.activeTab.close();
          break;
        case "change":
          window_screenshot.change_tab(data.content);
          break;
        case "open":
          var scale_tab = tabs.activeTab;
          timer.setTimeout(function(){scale_tab.close();}, 100);
          tabs.open(data.url);
          break;
        case "search":
          var scale_tab = tabs.activeTab;
          timer.setTimeout(function(){scale_tab.close();}, 100);
          tabs.open("www.google.com/search?q=" + data.url);
          break;
      }
    });
  }
});
