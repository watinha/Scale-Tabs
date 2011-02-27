<!-- edited by Willian Massami Watanabe [talk@watinha.com]  -->

 The main module has the goal of replacing the about:blank new tabs default page, with the scale_tabs.html page (data/scale_tabs.html).

 After replacing the blank default new tab webpage, we insert a page-mod functionality to pass chrome privileged data to the scale_tabs.html page. These data include: tabs title, favicon, index position and window screenshot.

 These data are obtained from the enhanced tab object (from the tabs standard module together with the window_screenshot module developed in this addon). The page-mod content script is responsible for generating the dynamic webpage layout of the scale_tabs.html page and the event handler that actually change the tabs in the browser.

 The page-mod is also responsible for dealing with the contentScript and the main addon files communication via messages.
