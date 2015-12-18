self.port.on("tabs", function (data) {
    for (var i = 0; i < data.length; i++) {
        var img = document.createElement("img");
        img.src = data[i].image;
        document.body.appendChild(img);
    };
});
