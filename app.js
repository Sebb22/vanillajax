var app = {

  buttonElement: document.querySelector("#surprise"),

  ulElement: document.createElement("ul"),


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
    app.ajaxGet("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?limit=3", app.callback);
    document.querySelector("#test").appendChild(app.ulElement);
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
      // console.log(eventItem.title);
      // console.log(eventItem.geometries[i]);
      app.displayResponseItems(eventItem);
    }
  },

  displayResponseItems: function (eventItem) {
    if (eventItem != "") {

      var itemElement = document.createElement("li");
      itemElement.setAttribute("class","eventItem");
      eventItemCoordinates = eventItem.geometries[0].coordinates;
      itemElement.innerHTML = eventItem.title;
      itemElement.dataset.coordinates = eventItemCoordinates;

      app.ulElement.appendChild(itemElement);
      app.ulElement.setAttribute("class","ulElement");
      itemElement.addEventListener("click", app.handleDisplayMap);
    }
  },

  handleDisplayMap: function () {
    // itemElement.getAttribute("data-coordinates");

    var itemElement = event.currentTarget;
    console.log(itemElement.getAttribute("data-coordinates"));

    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    }
  
    console.log(map);
  }

}

app.init();

/*
<script>
     var map;
     function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: -34.397, lng: 150.644},
         zoom: 8
       });
     }
   </script>
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
   async defer></script>
*/