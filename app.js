var app = {

    buttonElement : document.querySelector("#surprise"),

    ulElement:document.createElement("ul"),

   init: function () {
app.buttonElement.addEventListener("click",app.handleAjaxCall);

   },

   handleAjaxCall: function(){
      event.preventDefault();
      if(app.ulElement.hasChildNodes()){
console.log("true");
app.ulElement="";
}

      console.log('click!');
      app.ajaxGet("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?limit=1",app.callback);
      document.querySelector("#test").appendChild(app.ulElement);
   },

   ajaxGet: function(url,callback){
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

   callback:function(response){
     var response = JSON.parse(response);
     console.log(response);
//console.log(response["events"][i]["geometries"]["coordinate"]);
     for(var i=0;i<=response.events.length;i++){
         var eventItem=response["events"][i]["title"];
         console.log(response["events"][i]["geometries"]["coordinates"]);
//console.log(eventCoordinates);
app.displayResponseItems(eventItem,eventCoordinates);
     }
 
   },

   displayResponseItems:function(eventItem,eventCoordinates){
  if(eventItem!=""){
 
   var itemElement = document.createElement("li");
   itemElement.innerHTML=eventItem;
   //itemElement.dataset=eventItem;
  
   app.ulElement.appendChild(itemElement);
itemElement.addEventListener("click",app.handleDisplayMap);
  }
},

handleDisplayMap:function(){
 console.log("pop");
 var itemElement=event.currentTarget;
 //console.log(itemElement.data);
 
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