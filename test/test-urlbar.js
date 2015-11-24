const window_utils = require("window-utils");
var urlbar = require("urlbar").get_urlbar();

exports.test_urlbar = function(test){
  var urlbar_test;
  var window_test;

  let tracker = {
    onTrack: function (browser_window) {
      urlbar_test = browser_window.gURLBar;
      window_test = browser_window;
    },
    onUntrack: function (){
    }
  };
  var tracker = new window_utils.WindowTracker(tracker);

  /*
   * Testing that the urlbar object has the gurlbar reference
   */
  test.assertEqual(urlbar_test, urlbar.urlbar);

  /*
   * Testing if the urlbar.clear function works
   */
  urlbar.clear();
  test.assertEqual("", urlbar_test.textValue);

  /*
   * Tests if the keyup event listener is set by the method
   */
  function keyup_handler(event){
    test.assert(true);
  }
  urlbar.set_keyup_handler(keyup_handler);

  var event = window_test.document.createEvent('KeyEvents');
  event.initEvent('keyup', true, true, null, false, false, false, false, 115, 0);
  event.target = urlbar_test;
  urlbar_test.dispatchEvent(event);
};
