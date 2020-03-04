var app = {

  buttonElement: document.querySelector("#surprise"),

  ulElement: document.createElement("ul"),

  map: document.querySelector("#map"),

  init: function () {
    app.buttonElement.addEventListener("click", app.handleAjaxCall);

  },

  handleAjaxCall: function () {
    event.preventDefault();
    if (app.ulElement.hasChildNodes()) {
      console.log("true");
      app.ulElement = "";
    }

    console.log('click!');
    app.ajaxGet("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?limit=10", app.callback);
    document.querySelector("#test").appendChild(app.ulElement);

    // app.handleDisplayMap();
    // console.log(app.ulElement);
  },

  ajaxGet: function (url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
        // Appelle la fonction callback en lui passant la réponse de la requête
        app.callback(req.responseText);
      } else {
        console.error(req.status + " " + req.statusText + " " + url);
      }
    });
    req.addEventListener("error", function () {
      console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
  },

  callback: function (response) {
    var response = JSON.parse(response);
    //about setting apart events
    response = response.events;
    // console.log(response);

    //loop displaying every item
    for (var i = 0; i < response.length; i++) {
      var eventItem = response[i];
      app.displayResponseItems(eventItem);
    }
  },

  displayResponseItems: function (eventItem) {
    if (eventItem != "") {
      //console.log(eventItem);
      var itemElement = document.createElement("li");
      itemElement.setAttribute("class", "eventItem");
      eventItemCoordinates = eventItem.geometries[0].coordinates;
      // console.log(eventItemCoordinates);
      itemElement.innerHTML = eventItem.title;
      itemElement.dataset.coordinateX = eventItemCoordinates[0];
      itemElement.dataset.coordinateY = eventItemCoordinates[1];

      app.ulElement.appendChild(itemElement);
      app.ulElement.setAttribute("class", "ulElement");
      itemElement.addEventListener("click", app.handleDisplayMap);

    }

  },

  handleDisplayMap: function () {
    var itemElement = event.currentTarget;
    var itemElementCoordinateX = itemElement.getAttribute("data-coordinate-x");
    var itemElementCoordinateY = itemElement.getAttribute("data-coordinate-y");

    //initialize the map on the "map" div with a given center and zoom
    app.map = L.map('map', {
      center: [itemElementCoordinateY, itemElementCoordinateX],
      zoom: 13
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-v9',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoic2ViYjIyIiwiYSI6ImNrN2JtaTVvajA0NHgzZXJ5bHY3dnBxMjIifQ.NF7QR5HHWJSFctdhrSr7iQ'
    }).addTo(app.map);

    L.marker([itemElementCoordinateY, itemElementCoordinateX]).addTo(app.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

  }

}

app.init();

