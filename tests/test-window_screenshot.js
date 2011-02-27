var window_screenshot = require("window_screenshot").get_Screenshot_window();
var tabs = require("tabs");
var data = require("self").data;

exports.tab_opening = function(test){
  tabs.open("http://www.google.com");
  tabs.open("http://www.yahoo.com");
  tabs.open("http://www.twitter.com");

  var count_tabs_loaded = 0;
  tabs.on("ready", function(tab){
    count_tabs_loaded++; 
    window_screenshot.load_tab_data(tab);
    test.assertEqual(tab.screenshot.substring(0,4), "data", "Testing if the TAB Jetpack object was enhanced with the screenshot attribute for tab" + tab.index);
    if(count_tabs_loaded == 3)
      test.done();
  });
  
  test.waitUntilDone(30000);
};

exports.tab_changing = function(test){
  tabs.open("http://www.facebook.com");
  tabs.on("ready", function(tab){
    window_screenshot.change_tab(1);
    test.assertEqual(tabs.activeTab.title, "Google", "Testing if the tab change functionality is working.");
    test.assertEqual(tabs.length, 4, "Testing if the last tab was closed.");
    test.done();
  });
  test.waitUntilDone(10000);
};
