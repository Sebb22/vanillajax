var app = {

  buttonElement: document.querySelector("#surprise"),

  ulElement: document.createElement("ul"),

  map: document.querySelector("#map"),

  eventUrl: "https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?limit=10",

  query: "",

  infoUrl: "http://newsapi.org/v2/everything?sources=google-news?q=volcano&apiKey=dcaebe9e1393479fb40ec06801e47ed5",

  itemElement: "",

  //infoDescription: "",

  init: function () {
    app.buttonElement.addEventListener("click", app.handleAjaxCall);

  },

  //event handling event's ajax call
  handleAjaxCall: function () {
    event.preventDefault();
    if (app.ulElement.hasChildNodes()) {
      console.log("true");
      app.ulElement = "";
    }

    console.log('click!');
    app.ajaxGet(app.eventUrl, app.eventCallback);
    document.querySelector("#test").appendChild(app.ulElement);
  },

  //js vanilla ajax call
  ajaxGet: function (url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
        // Appelle la fonction callback en lui passant la réponse de la requête
        if (url === app.eventUrl) {
          app.eventCallback(req.responseText);
        }
        else if (url === app.infoUrl) {
          app.postCallback(req.responseText);
        }

      } else {
        console.error(req.status + " " + req.statusText + " " + url);
      }
    });
    req.addEventListener("error", function () {
      console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
  },

  //event's ajax callback function
  eventCallback: function (response) {
    //console.log(response);
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

  //post's ajax callback function
  postCallback: function (response) {
    app.infoDescription = "";
    var response = JSON.parse(response);
    var postInfos = response;
    //console.log(postInfos.totalResults);
    //console.log(postInfos.articles[0]);
    if (postInfos.totalResults > 0) {
      var infoDescription = postInfos.articles[0].description;
      var infoPicture = postInfos.articles[0].urlToImage;
      var infoUrl = postInfos.articles[0].url;
    }
    app.handleDisplayMap(infoDescription, infoPicture, infoUrl);

},

  //function displaying events into li
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

      //event on click displaying map
      itemElement.addEventListener("click", () => {
        app.handlePopUpInfo();
        //window.scrollTo(0, 1000);
        window.scrollTo({
  top: 1000,
  left: 0,
  behavior: 'smooth'
});
      });

    }

  },

  //event displaying a map relative to event clicked
  handleDisplayMap: function (infoDescription, infoPicture, infoUrl) {

    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }

    var itemElementCoordinateX = app.itemElement.getAttribute("data-coordinate-x");
    var itemElementCoordinateY = app.itemElement.getAttribute("data-coordinate-y");

    //app.handlePopUpInfo(itemElement);

    //initialize the map on the "map" div with a given center and zoom
    app.map = L.map('map', {
      center: [itemElementCoordinateY, itemElementCoordinateX],
      zoom: 10,
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-v9',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoic2ViYjIyIiwiYSI6ImNrN2JtaTVvajA0NHgzZXJ5bHY3dnBxMjIifQ.NF7QR5HHWJSFctdhrSr7iQ'
    }).addTo(app.map);

    //L.marker([itemElementCoordinateY, itemElementCoordinateX]).addTo(app.map)
    if (infoDescription) {
      if (infoPicture != null) {
        var popup = L.popup()
          .setLatLng([itemElementCoordinateY, itemElementCoordinateX])
          .setContent("<img src=" + infoPicture + " style=display:block;width:95%>"
            + "<p>" + infoDescription + "</p>"
            + "<a href=" + infoUrl + " target=_blank>See article</a>")
          .openOn(app.map);
      } else {
        popup = L.popup()
          .setLatLng([itemElementCoordinateY, itemElementCoordinateX])
          .setContent("<p>" + infoDescription + "</p>"
            + "<a href=" + infoUrl + " target=_blank>See article</a>")
          .openOn(app.map);
      }
    }
  },

  //function setting ajax query  
  handlePopUpInfo: function () {
    app.itemElement = event.currentTarget;
    

console.log(app.itemElement.innerHTML.replace(/[\W_]+/g,"+"));

    app.query = app.itemElement.innerHTML.replace(/[\W_]+/g,"+");

    app.infoUrl = "http://newsapi.org/v2/everything?q=" + app.query + "&apiKey=dcaebe9e1393479fb40ec06801e47ed5";

    app.ajaxGet(app.infoUrl, app.postCallback);
    // app.handleDisplayMap(app.itemElement);
  }

}

app.init();


//http://newsapi.org/v2/top-headlines?country=fr&apiKey=dcaebe9e1393479fb40ec06801e47ed5//