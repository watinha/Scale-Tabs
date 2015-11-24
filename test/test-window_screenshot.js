var window_screenshot = require("window_screenshot").get_Screenshot_window();
var tabs = require("tabs");
var data = require("self").data;
var timer = require("timer");

exports.tab_opening = function(test){
  tabs.open("about:blank");
  tabs.open("about:blank");
  tabs.open("about:addons");

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
  tabs.open("about:blank");
  tabs.on("ready", function(tab){
    window_screenshot.change_tab("Complementos");
    timer.setTimeout(function(){test.assertEqual(tabs.activeTab.title, "Complementos", "Testing if the tab change functionality is working.");}, 200);
    timer.setTimeout(function(){test.assertEqual(tabs.length, 4, "Testing if the last tab was closed.");}, 200);
    test.done();
  });
  test.waitUntilDone(10000);
};
