self.port.on("tabs", function (data) {
    var img;
    for (var i = 0; i < data.length; i++) {
        img = document.createElement("img");
        img.src = data[i].image;
        document.body.appendChild(img);
    }
});
