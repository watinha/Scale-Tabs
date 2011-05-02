/* ***************************************************
 * 
 * contentScript name: pagemod_code.js
 * author: Willian Massami Watanabe (talk@watinha.com)
 * last changed: 10/02/2011 
 * 
 * **************************************************/

/*
 * This content script is responsible for:
 *  1. Generating the base DOM structure for the tabs informations.
 *  2. Adding the behaviour that will send task request to the chrome 
 *      privileged page-mod code in the main module, via event handlers.
 *  3. The event handlers include the mouse click events and the keyboard
 *      events for filtering the tabs and selecting them via keypresses
 */

/*
 * function select_tab function is responsible for sending the task request for 
 *  changing the tab to the chrome privileged page-mod code in the main module.
 *  @params tab_index: integer that identifies the tab representation selected.
 *  @params tab_li_element: li DOM element to be animated by the function
 */
function select_tab(tab_title, tab_li_element){
  /*
   * Animating the function given the transitions propertie in the CSS of the 
   *  scale_tabs.html code
   */
  var screenshot = tab_li_element.getElementsByTagName("img")[0];
  screenshot.style.position = "fixed";
  screenshot.style.top = 0;
  screenshot.style.left = 0;
  screenshot.style.width = window.innerWidth;
  screenshot.style.height = window.innerHeight;
  screenshot.style.zIndex = 99;

  var data = {
    type: "change",
    content: tab_title
  };
  /*
   * Waiting for the animation effect and then sending the request for changing tabs
   */
  setTimeout(function(){postMessage(data)}, 100);
}

/*
 * Generating the tab data presentation DOM elements, to be included 
 *  in the scale_tabs.html page.
 */
onMessage = function onMessage(message) {
  /*
   * Catching the parameters separated by ,
   */
  var screenshot_size = message.screenshot_size;
  var title = message.title;
  var favicon = message.favicon;
  var image_file = message.screenshot;
  var tab_index = message.index;
  /*
   * Checking the width/height proportion of the window.
   */
  var width_height_proportion = window.innerWidth/window.innerHeight;

  /*
   * Generating the img element that contains the screenshot image, with
   *  its ideal size (height and width)
   */
  var screenshot_image = document.createElement("img");
  screenshot_image.height = parseInt(screenshot_size);
  screenshot_image.width = parseInt(screenshot_size)*width_height_proportion;
  screenshot_image.style.height = parseInt(screenshot_size) + "px";
  screenshot_image.style.width = parseInt(screenshot_size)*width_height_proportion + "px";
  screenshot_image.src = image_file;

  /*
   * Generating the li element that will hold the tab information to be displayed
   */
  var li_element = document.createElement("li");
  li_element.style.position = "relative";
  li_element.style.height = screenshot_image.style.height;
  li_element.style.width = screenshot_image.style.width;
  li_element.tab_index = tab_index;

  /*
   * Adding the base behaviour for changing tabs given a onclick event
   */
  li_element.onclick = function(event){
    var self = this;
    select_tab(title, self);
  };

  /*
   * Generating the span element that will hold the title and favicon 
   *  tab data.
   */
  var span_element = document.createElement("span");
  span_element.style.position = "absolute";
  span_element.style.bottom = 0;
  span_element.style.left = 0;
  span_element.style.width = screenshot_image.style.width;
  span_element.style.height = "16px";
  span_element.style.padding = "10px 0";
  span_element.style.backgroundColor = "#333333";
  span_element.style.color = "#FFFFFF";
  span_element.style.fontSize = "16px";
  span_element.style.overflow = "hidden";
  span_element.style.opacity = 0.9;
  span_element.innerHTML = "<img style='position:relative;top:3px;margin-right:3px' src='" + favicon + "'></img>" + title;

  /*
   * Including the newly generated elements in the webpage
   */
  li_element.appendChild(screenshot_image);
  li_element.appendChild(span_element);
  document.getElementById("tabs_list").appendChild(li_element);
};

window.onload = function(){
  
  /*
   * Adding the filter functionality as an input field
   */
  var filter_div = document.createElement("div");
  var label_element = document.createElement("label");
  var input_element = document.createElement("input");

  filter_div.className = "filter";

  label_element.innerHTML = "Search field: ";

  input_element.type = "text";
  input_element.size = 60;
  input_element.tabIndex = "1";

  /*
   * Calculating the selection position for the keyboard selection functionality
   */
  var selected = -1;
  input_element.onkeyup = function(event){
    /* 
      Key codes for the keys:
      27 -> ESC: closes the scale_tabs.html tab and returns for the last active tab.
      40 -> down arrow: moves the selection cursor down in the matrix representation.
      38 -> up arrow: moves the selection cursor up in the matrix representation.
      39 -> right arrow: moves the selection cursor right in the matrix represetation.
      37 -> left arrow: moves the selection cursor left in the matrix representation.
      13 -> enter: selects and changes the active tab in the browser.
    */
    var images = document.querySelectorAll("ul > li > img");
    var number_per_row = Math.floor(window.innerWidth/(images[0].width + 30));  
    var tab_elements = document.querySelectorAll("ul#tabs_list > li");
    if(event.keyCode == 27){ //ESC
      data = {
        type: "close"
      };
      postMessage(data);
      return ;
    }
    if((event.keyCode == 39 || event.keyCode == 40|| event.keyCode == 38|| event.keyCode == 37) && selected == -1){
      selected = 0;
      tab_elements[selected].classList.add("selected"); 
      return ;
    }
    if(event.keyCode == 39){ //RIGHT ARROW
      previous_selected = selected;
      selected = (++selected==tab_elements.length?0:selected);
      tab_elements[previous_selected].classList.remove("selected");
      tab_elements[selected].classList.add("selected"); 
      return ;
    }
    if(event.keyCode == 37){ //LEFT ARROW
      previous_selected = selected;
      selected = (--selected<0?(tab_elements.length-1):selected);
      tab_elements[previous_selected].classList.remove("selected");
      tab_elements[selected].classList.add("selected"); 
      return ;
    }
    if(event.keyCode == 40){ //DOWN ARROW
      previous_selected = selected;
      selected = selected + number_per_row;
      selected = (selected>=tab_elements.length?(tab_elements.length-1):selected);
      tab_elements[previous_selected].classList.remove("selected");
      tab_elements[selected].classList.add("selected"); 
      return ;
    }
    if(event.keyCode == 38){ //UP ARROW
      previous_selected = selected;
      selected = selected - number_per_row;
      selected = (selected<0?0:selected);
      tab_elements[previous_selected].classList.remove("selected");
      tab_elements[selected].classList.add("selected"); 
      return ;
    } 
    if(event.keyCode == 13){ //ENTER
      if (selected == -1){
        var self = this;
        var data = {
          url: self.value
        };
        if (this.value.split(" ").length == 1)
          data.type = "open";
        else
          data.type = "search";
        postMessage(data);
      }
      var self = tab_elements[selected];
      /*
       * Generating a click event to call for the select_tab function implicitly
       */
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      self.dispatchEvent(evt);
      return ;
    }
    /*
     * If the key pressed is not a arrow, ESC or enter, the input will get in the 
     *  filtering mode, which means it will present only the tabs that have a title
     *  that matches the input.value.
     */

    // regularizing the expression lookup in the string 
    var select_words = this.value.split(" ");
    var words_expression = ""; //  "google(.)*yahoo(.)*weather"
    for (var count_words in select_words)
      words_expression += select_words[count_words] + "(.)*";

    var terms_filter = new RegExp(words_expression , "i");
    var cont_selected_tabs = 0;
    for(var cont_tabs = 0; cont_tabs < tab_elements.length; cont_tabs++){
      tab_elements[cont_tabs].classList.remove("only");   
      tab_elements[cont_tabs].classList.remove("selected");   
      if(tab_elements[cont_tabs].querySelectorAll("span")[0].childNodes[1].nodeValue.search(terms_filter) > -1){
        tab_elements[cont_tabs].classList.remove("filtered"); 
        cont_selected_tabs++;
        selected = cont_tabs;
      }else{
        tab_elements[cont_tabs].classList.add("filtered");
      }    
    }
    if (cont_selected_tabs == 1){
      tab_elements[selected].classList.add("selected");   
      tab_elements[selected].classList.add("only");   
    }
    if (cont_selected_tabs == 0)
      selected = -1;
  };

  /*
   * Including the filtering functionality elements in the DOM tree
   */
  filter_div.appendChild(label_element);
  filter_div.appendChild(input_element);
  document.body.appendChild(filter_div);

  /*
   * Setting the input_element of the filtering functionality to focus.
   */
  input_element.focus();

  /*
   * Next few lines generate and include the author div, containing 
   *  information about the author.
   */
  var author_div = document.createElement("div");
  var watinha_link = document.createElement("a");

  author_div.className = "author"; 

  watinha_link.innerHTML = "@watinha";
  watinha_link.title = "watinha's link";
  watinha_link.href = "http://www.watinha.com";

  author_div.innerHTML = "designed by ";
  author_div.appendChild(watinha_link);
  document.body.appendChild(author_div);
};
