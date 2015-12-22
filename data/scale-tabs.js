(function () {
    var tabs = [];
    self.port.on("tabs", function (data) {
        var img;
        tabs = data;
        document.body.innerHTML = "";
        for (var i = 0; i < tabs.length; i++) {
            img = document.createElement("img");
            img.src = tabs[i].image;
            tabs[i].element = img;
            document.body.appendChild(img);
        }
    });
    self.port.on("search", function (search_param) {
        var imgs = document.querySelectorAll("body > img");
        for (var i = 0; i < tabs.length; i++) {
            if ((tabs[i].title &&
                    tabs[i].title.search(search_param) >= 0) ||
                (tabs[i].url &&
                    tabs[i].url.search(search_param) >= 0)) {
                tabs[i].element.removeAttribute("class");
            } else {
                tabs[i].element.className = "removido";
            }
        };
    });
})();
